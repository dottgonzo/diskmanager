"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execSync = require("sync-exec");
var hasbin = require("hasbin");
function FolderStat(folder) {
    var folderutilization = execSync("df -BM --no-sync " + folder).stdout.split("\n");
    var row = folderutilization[1].replace(/ +(?= )/g, "").split(" ");
    var folderObj = {
        humansize: row[1],
        available: row[3],
        used: row[2],
        percentused: row[4],
        mounted: row[5],
    };
    return folderObj;
}
exports.FolderStat = FolderStat;
function device(disk) {
    for (var i = 0; i < all().length; i++) {
        if (all()[i].disk === disk)
            return all()[i];
    }
    throw new Error('not founded');
}
exports.device = device;
function partitionFromBitlockerUuid(BitlockerUuid) {
    var allPartitions = listPartitions();
    for (var ii = 0; ii < allPartitions.length; ii++) {
        if (allPartitions[ii].bitLockerVolumeUuid === BitlockerUuid)
            return allPartitions[ii];
    }
    return false;
}
exports.partitionFromBitlockerUuid = partitionFromBitlockerUuid;
function partitionFromUuid(uuid) {
    var allPartitions = listPartitions();
    for (var ii = 0; ii < allPartitions.length; ii++) {
        if (allPartitions[ii].UUID === uuid)
            return allPartitions[ii];
    }
    return false;
}
exports.partitionFromUuid = partitionFromUuid;
function partitionFromPartUuid(partUuid) {
    var allPartitions = listPartitions();
    for (var ii = 0; ii < allPartitions.length; ii++) {
        if (allPartitions[ii].partUuid === partUuid)
            return allPartitions[ii];
    }
    return false;
}
exports.partitionFromPartUuid = partitionFromPartUuid;
function listAvailablePartitions() {
    var partitions = [];
    var allDisks = all();
    for (var i = 0; i < allDisks.length; i++) {
        for (var ii = 0; ii < allDisks[i].partitions.length; ii++) {
            if ((allDisks[i].partitions[ii].UUID || allDisks[i].partitions[ii].partUuid) && allDisks[i].partitions[ii].type !== 'Extended')
                partitions.push(allDisks[i].partitions[ii]);
        }
    }
    return partitions;
}
exports.listAvailablePartitions = listAvailablePartitions;
function listPartitions() {
    var partitions = [];
    var allDisks = all();
    for (var i = 0; i < allDisks.length; i++) {
        for (var ii = 0; ii < allDisks[i].partitions.length; ii++) {
            if (allDisks[i].partitions[ii].UUID || allDisks[i].partitions[ii].partUuid)
                partitions.push(allDisks[i].partitions[ii]);
        }
    }
    return partitions;
}
exports.listPartitions = listPartitions;
function all(options) {
    if (!options)
        options = {};
    if (options.checkBitlocker !== false || hasbin.sync('dislocker'))
        options.checkBitlocker = true;
    var blkidlines = execSync("sudo blkid").stdout.split("\n");
    var cmd = "sudo fdisk -l";
    var fdi = execSync(cmd).stdout.split("\n");
    var disks = [];
    for (var i = 0; i < fdi.length; i++) {
        var line = fdi[i].replace(/ +(?= )/g, "").split(" ");
        if (fdi[i].split("/dev/ram").length < 2 && fdi[i].split("isk /").length > 1) {
            var disk = line[1].replace(":", "");
            var sectors = parseInt(line[6]);
            var size = parseInt(line[4]);
            disks.push({ disk: disk, sectors: sectors, size: size, partitions: [], block: 512, used_blocks: null });
        }
        else if (disks[0] && fdi[i].split(":").length < 2 && fdi[i].split("dev/").length > 1 && line.length > 1) {
            var uuid = void 0;
            var label = void 0;
            var labelexists = false;
            var fileSystemType = void 0;
            var partUuid = void 0;
            for (var b = 0; b < blkidlines.length; b++) {
                var bline = blkidlines[b].replace(/ +(?= )/g, "").split(" ");
                if (bline[0] === line[0] + ":") {
                    for (var bl = 0; bl < bline.length; bl++) {
                        if (bline[bl].split('ABEL="').length > 1 && bline[bl].split('ABEL="')[1].split('"')[0].split(":").length < 2) {
                            labelexists = true;
                            label = bline[bl].split('ABEL="')[1].split('"')[0];
                        }
                        if (bline[bl].split('UID="').length > 1 && bline[bl].split('ARTUUID="').length < 2 && bline[bl].split('UID="')[1].split('"')[0].split(":").length < 2) {
                            uuid = bline[bl].split('UID="')[1].split('"')[0];
                        }
                        if (bline[bl].split('TYPE="').length > 1 && bline[bl].split('TYPE="')[1].split('"')[0]) {
                            fileSystemType = bline[bl].split('TYPE="')[1].split('"')[0];
                        }
                        if (bline[bl].split('PARTUUID="').length > 1 && bline[bl].split('PARTUUID="')[1].split('"')[0]) {
                            partUuid = bline[bl].split('PARTUUID="')[1].split('"')[0];
                        }
                    }
                }
            }
            var partition = line[0];
            var boot = void 0;
            var sector_start = void 0;
            var sector_stop = void 0;
            var sectors = void 0;
            var type = "";
            var typeId = void 0;
            var bitLockerVolumeUuid = void 0;
            if (options.checkBitlocker) {
                var newArrayOfLineOfRightDatum = [];
                var finded288ByteRow = false;
                var bitLockerCheckDiskOut = execSync("sudo dislocker-metadata -V " + partition).stdout.split("\n");
                for (var i_1 = 0; i_1 < bitLockerCheckDiskOut.length; i_1++) {
                    if (bitLockerCheckDiskOut[i_1].split("datum size: 0x0120 (288)").length === 2)
                        finded288ByteRow = true;
                    if (bitLockerCheckDiskOut[i_1].split("Recovery Key GUID: '").length > 1 && finded288ByteRow && !bitLockerVolumeUuid) {
                        bitLockerVolumeUuid = bitLockerCheckDiskOut[i_1].split("Recovery Key GUID: '")[1].split("'")[0];
                        break;
                    }
                }
            }
            if (line[1] === "*") {
                boot = true;
                sector_start = parseInt(line[2]);
                sector_stop = parseInt(line[3]);
                sectors = parseInt(line[4]);
                typeId = parseInt(line[6]);
                for (var l = 7; l < line.length; l++) {
                    if (l === line.length - 1) {
                        type = type + line[l];
                    }
                    else {
                        type = type + line[l] + " ";
                    }
                }
            }
            else {
                boot = false;
                sector_start = parseInt(line[1]);
                sector_stop = parseInt(line[2]);
                sectors = parseInt(line[3]);
                typeId = parseInt(line[5]);
                for (var l = 6; l < line.length; l++) {
                    if (l === line.length - 1) {
                        type = type + line[l];
                    }
                    else {
                        type = type + line[l] + " ";
                    }
                }
            }
            var size = disks[disks.length - 1].block * sectors;
            var DISK = void 0;
            if (labelexists) {
                DISK = { partUuid: partUuid, fileSystemType: fileSystemType, UUID: uuid, disk: disks[disks.length - 1].disk, label: label, name: partition.split('/')[partition.split('/').length - 1], partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot, mounted: '', percentused: '', used: '', available: '', humansize: '' };
            }
            else {
                DISK = { partUuid: partUuid, fileSystemType: fileSystemType, UUID: uuid, disk: disks[disks.length - 1].disk, partition: partition, name: partition.split('/')[partition.split('/').length - 1], sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot, mounted: '', percentused: '', used: '', available: '', humansize: '' };
            }
            if (bitLockerVolumeUuid)
                DISK.bitLockerVolumeUuid = bitLockerVolumeUuid;
            var diskutilization = execSync("df -BM --no-sync").stdout.split("\n");
            for (var du = 0; du < diskutilization.length; du++) {
                var row = diskutilization[du].replace(/ +(?= )/g, "").split(" ");
                if (row[0] === partition) {
                    DISK.humansize = row[1];
                    DISK.available = row[3];
                    DISK.used = row[2];
                    DISK.percentused = row[4];
                    DISK.mounted = row[5];
                }
            }
            disks[disks.length - 1].partitions.push(DISK);
        }
        else if (disks[0] && line[0] === "Units:") {
            disks[disks.length - 1].block = parseInt(line[5]);
        }
    }
    for (var i = 0; i < disks.length; i++) {
        if (disks[i].partitions.length > 0) {
            disks[i].used_blocks = disks[i].partitions[disks[i].partitions.length - 1].sectors_stop;
        }
    }
    return disks;
}
exports.all = all;
