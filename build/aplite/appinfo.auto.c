#include "pebble_process_info.h"
#include "src/resource_ids.auto.h"

const PebbleProcessInfo __pbl_app_info __attribute__ ((section (".pbl_header"))) = {
  .header = "PBLAPP",
  .struct_version = { PROCESS_INFO_CURRENT_STRUCT_VERSION_MAJOR, PROCESS_INFO_CURRENT_STRUCT_VERSION_MINOR },
  .sdk_version = { PROCESS_INFO_CURRENT_SDK_VERSION_MAJOR, PROCESS_INFO_CURRENT_SDK_VERSION_MINOR },
  .process_version = { 1, 2 },
  .load_size = 0xb6b6,
  .offset = 0xb6b6b6b6,
  .crc = 0xb6b6b6b6,
  .name = "Trefoil",
  .company = "Gitgud Software",
  .icon_resource_id = RESOURCE_ID_IMAGES_TREFOIL_ICON_PNG,
  .sym_table_addr = 0xA7A7A7A7,
  .flags = 0,
  .num_reloc_entries = 0xdeadcafe,
  .uuid = { 0x11, 0xF4, 0x71, 0xD2, 0x20, 0x6C, 0x4F, 0x26, 0x91, 0x30, 0xD2, 0xB2, 0xBF, 0x3F, 0xDF, 0x05 },
  .virtual_size = 0xb6b6
};
