"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execSync = require("sync-exec");
function device(disk) {
    for (var i = 0; i < all().length; i++) {
        if (all()[i].disk === disk)
            return all()[i];
    }
    throw new Error('not founded');
}
exports.device = device;
function partitionFromUuid(uuid) {
    var allDisks = all();
    for (var i = 0; i < allDisks.length; i++) {
        for (var ii = 0; ii < allDisks[i].partitions.length; ii++) {
            if (allDisks[i].partitions[ii].UUID === uuid)
                return allDisks[i].partitions[ii];
        }
    }
    return false;
}
exports.partitionFromUuid = partitionFromUuid;
function listAvailablePartitions() {
    var partitions = [];
    var allDisks = all();
    for (var i = 0; i < allDisks.length; i++) {
        for (var ii = 0; ii < allDisks[i].partitions.length; ii++) {
            if (allDisks[i].partitions[ii].UUID && allDisks[i].partitions[ii].available && allDisks[i].partitions[ii].available.length > 1 && parseInt(allDisks[i].partitions[ii].available) > 1)
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
            if (allDisks[i].partitions[ii].UUID)
                partitions.push(allDisks[i].partitions[ii]);
        }
    }
    return partitions;
}
exports.listPartitions = listPartitions;
function all() {
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
                DISK = { UUID: uuid, label: label, name: partition.split('/')[partition.split('/').length - 1], partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot, mounted: '', percentused: '', used: '', available: '', humansize: '' };
            }
            else {
                DISK = { UUID: uuid, partition: partition, name: partition.split('/')[partition.split('/').length - 1], sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot, mounted: '', percentused: '', used: '', available: '', humansize: '' };
            }
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
