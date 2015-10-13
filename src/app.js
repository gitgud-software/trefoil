/**
 * Trefoil
 *
 * Welcome, /g/entoomen, to the source code.
 */
// Import libraries for UI, AJAX, etc.
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');


var mainmenu;
var threadmenu;
var postmenu;
var postCard;
var failCard = new UI.Card({
    textColor: 'green',
    backgroundColor: 'black',
    title: 'Error',
    body: 'Can\'t connect to the Internet. Check your connection and try again.',
    scrollable: false,
    style: 'large'
});

var process = function(str) {
    var comment = str;
    if (comment !== undefined) {
        comment = comment.replace(/<br>/g, '\n');
        comment = comment.replace(/<[^>]*>/g, '');
        comment = comment.replace(/&quot;/g, '\"');
        comment = comment.replace(/&amp;/g, '&');
        comment = comment.replace(/&#44;/g, ',');
        comment = comment.replace(/&lt;/g, '<');
        comment = comment.replace(/&gt;/g, '>');
        comment = comment.replace(/&#039;/g, '\'');
    }
    return comment;
};

var parseBoards = function(data) {
    var items = [];
    for (var i = 0; i < data.boards.length; i++) {
        var title = '/' + data.boards[i].board + '/';
        var subtitle = data.boards[i].title;
        var boardID = data.boards[i].board;

        if (title != '/f/') {
            items.push({
                title: title,
                subtitle: subtitle,
                boardID: boardID
            });
        }
    }
    return items;
};

var parseThreads = function(data) {
    var pages = [];
    for (var i = 0; i < data.length; i++) {
        var section = 'Page ' + data[i].page;
        var threads = [];
        for (var j = 0; j < data[i].threads.length; j++) {
            var no = data[i].threads[j].no;
            if (data[i].threads[j].no === undefined) {
                no = '???';
            }
            var title;
            if (data[i].threads[j].com !== undefined) {
                title = data[i].threads[j].com;
                title = process(title);
            }
            if (data[i].threads[j].sub !== undefined) {
                title = data[i].threads[j].sub;
                title = process(title);
            }
            if (data[i].threads[j].filename !== undefined &&
                data[i].threads[j].ext !== undefined &&
                (title === undefined || title === '')) {
                title = '(Filename: ' + data[i].threads[j].filename + data[i].threads[j].ext + ')';
            }
            if (title !== undefined) {
                title = title.substring(0, 25);
            } else {
                title = 'Error: No Content Found';
            }
            var subtitle = '';
            if (data[i].threads[j].replies === 0) {
                subtitle = 'No Replies';
            } else if (data[i].threads[j].replies == 1) {
                subtitle = data[i].threads[j].replies + ' Reply';
            } else if (data[i].threads[j].replies > 1) {
                subtitle = data[i].threads[j].replies + ' Replies';
            } else if (data[i].threads[j].replies === undefined) {
                subtitle = '??? Replies';
            } else {
                subtitle = '??? Replies';
            }
            if (title !== undefined && subtitle !== undefined) {
                threads.push({
                    no: no,
                    title: title,
                    subtitle: subtitle
                });
            }
        }
        pages.push({
            title: section,
            items: threads
        });
    }
    return pages;
};

var parsePost = function(data) {
    var postList = [];
    for (var i = 0; i < data.posts.length; i++) {
        var subtitle = data.posts[i].now;
        if (data.posts[i].now === undefined) {
            subtitle = '???';
        }
        var com = 'Error: Content Not Found';
        if (data.posts[i].com !== undefined) {
            com = data.posts[i].com;
            if (data.posts[i].filename !== undefined) {
                com = com + '\n\n(Filename: ' + data.posts[i].filename + data.posts[i].ext + ')';
            }
        } else {
            com = '(Filename: ' + data.posts[i].filename + data.posts[i].ext + ')';
        }
        com = process(com);
        var title = com.substring(0, 25);
        var no = 'No. ' + data.posts[i].no;
        if (data.posts[i].no === undefined) {
            no = 'No. ???';
        }
        var noRaw = data.posts[i].no;
        if (data.posts[i].no === undefined) {
            no = '???';
        }
        var name = data.posts[i].name;
        if (data.posts[i].name === undefined) {
            name = '';
        }
        if (data.posts[i].trip !== undefined) {
            name = name + "\n" + data.posts[i].trip;
        }
        if (data.posts[i].id !== undefined) {
            name = name + '\n(ID: ' + data.posts[i].id + ')';
        }
        if (title !== undefined && subtitle !== undefined) {
            postList.push({
                title: title,
                subtitle: subtitle,
                com: com,
                no: no,
                noRaw: noRaw,
                name: name
            });
        }
    }
    return postList;
};

var loading = new UI.Window();
var loadingIcon = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    image: 'images/Trefoil Icon.png',
    backgroundColor: 'green'
});

var postGet = function (dataIn, boardIn) {
  if (boardIn !== undefined && dataIn.item.no !== undefined) {
                    ajax({
                            url: 'https://a.4cdn.org' + boardIn + 'thread/' + dataIn.item.no + '.json',
                            type: 'json'
                        },
                        function(data) {
                            console.log('Retrieved posts in thread #' + dataIn.item.no + ' of ' + boardIn);
                            var postList = parsePost(data);
                            var threadTitle = dataIn.item.title;
                            if (threadTitle === undefined) {
                                threadTitle = '???';
                            }
                            postmenu = new UI.Menu({
                               textColor: 'black',
                               backgroundColor: 'green',
                               highlightBackgroundColor: 'black',
                               highlightTextColor: 'green',
                                sections: [{
                                    title: threadTitle,
                                    items: postList
                                }]
                            });
                            postmenu.show();

                            postmenu.on('select', function(g) {
                                var cardTitle;
                                var cardSub;
                                var cardContent;
                                if (g.item.name === undefined) {
                                    cardTitle = '???';
                                } else {
                                    cardTitle = g.item.name;
                                }
                                if (g.item.no === undefined) {
                                    cardSub = '???';
                                } else {
                                    cardSub = g.item.no;
                                }
                                if (g.item.com === undefined) {
                                    cardContent = 'Error';
                                } else {
                                    cardContent = g.item.com;
                                }
                                postCard = new UI.Card({
                                    textColor: 'black',
                                    backgroundColor: 'green',
                                    title: cardTitle,
                                    subtitle: cardSub,
                                    body: cardContent,
                                    scrollable: true,
                                    style: 'small'
                                });
                                if (postCard !== undefined) {
                                    postCard.show();
                                } else {
                                    failCard.show();
                                }
                              console.log(cardContent);
                            });
                          
                            postmenu.on('longSelect', function(g) {
                              var threadURL = 'https://boards.4chan.org' + boardIn + 'thread/' + dataIn.item.no + '#p' + g.item.noRaw;
                              console.log('Opening ' + threadURL);
                              Pebble.openURL(threadURL);
                            });
                        });
  }
};
                         
                                        

var threadGet = function(dataIn) {
if (dataIn.item.title !== undefined) {
    ajax({
            url: 'https://a.4cdn.org' + dataIn.item.title + 'catalog.json',
            type: 'json'
        },
        function(data) {
            var threadList = parseThreads(data);
            var boardName = dataIn.item.title;
            if (boardName === undefined) {
                boardName = '???';
            }
            console.log('Retrieved threads in ' + boardName + '!');
            threadmenu = new UI.Menu({
                textColor: 'black',
                backgroundColor: 'green',
                highlightBackgroundColor: 'black',
                highlightTextColor: 'green',
                sections: threadList
            });
            if (threadmenu !== undefined) {
                threadmenu.show();
            } else {
                failCard.show();
            }

            threadmenu.on('select', function(f) {
                console.log('Retrieving posts...');
                postGet(f, boardName);
            });
            threadmenu.on('longSelect', function(f) {
                var threadURL = 'https://boards.4chan.org' + boardName + 'thread/' + f.item.no;
                console.log('Opening ' + threadURL);
                Pebble.openURL(threadURL);

            });
        },
        function(error) {
            console.log('Failed to retrieve threads!');
            failCard.show();
        });
} else {
    failCard.show();
}
};

var boardGet = function(dataIn) {
    var boardList = parseBoards(dataIn);
    console.log('Boards retrieved!');
    mainmenu = new UI.Menu({
        textColor: 'black',
        backgroundColor: 'green',
        highlightBackgroundColor: 'black',
        highlightTextColor: 'green',
        sections: [{
            title: 'Boards',
            items: boardList
        }]
    });
    loading.hide();
    if (mainmenu !== undefined) {
        mainmenu.show();
    } else {
        failCard.show();
    }
    mainmenu.on('select', function(e) {
        console.log('Retrieving threads...');
        threadGet(e);
    });
  
    mainmenu.on('longSelect', function(f) {
                var threadURL = 'https://boards.4chan.org' + f.item.title + 'catalog.html';
                console.log('Opening ' + threadURL);
                Pebble.openURL(threadURL);

    });
};

loading.add(loadingIcon);
loading.show();

ajax({
        url: 'https://a.4cdn.org/boards.json',
        type: 'json'
    },
    function(data) {
        boardGet(data);
    },
    function(error) {
        console.log('Failed to retrieve boards!');
        failCard.show();
    });