
let execSync = require("sync-exec");
export = function(device?: string) {
    let cmd;
    if (device) {
        cmd = "fdisk " + device + " -l";
    } else {
        cmd = "fdisk -l";
    }
    var fdi = execSync(cmd).stdout.split("\n");
    let disks = [];
    for (var i = 0; i < fdi.length; i++) {
        let line = fdi[i].replace(/ +(?= )/g, "").split(" ");
        if (fdi[i].split("/dev/s").length > 1 && fdi[i].split("isk").length > 1) {

            let disk = line[1].replace(":", "");
            let sectors = parseInt(line[6]);
            let size = parseInt(line[4]);
            disks.push({ disk: disk, sectors: sectors, size: size, partitions: [] });
        } else if (fdi[i].split("/dev/s").length > 1 && line.length > 1) {


            let partition = line[0];
            let boot;
            let sector_start;
            let sector_stop;
            let sectors;

            let type = "";
            let typeId;

            if (line[1] == "*") {
                boot = true;
                sector_start = parseInt(line[2]);
                sector_stop = parseInt(line[3]);
                sectors = parseInt(line[4]);
                typeId = parseInt(line[6]);
                for (var l = 7; l < line.length; l++) {
                    if (l == line.length - 1) {
                        type = type + line[l];
                    } else {
                        type = type + line[l] + " ";
                    }
                }

            } else {
                boot = false;
                sector_start = parseInt(line[1]);
                sector_stop = parseInt(line[2]);
                sectors = parseInt(line[3]);
                typeId = parseInt(line[5]);
                for (var l = 6; l < line.length; l++) {
                    if (l == line.length - 1) {
                        type = type + line[l];
                    } else {
                        type = type + line[l] + " ";
                    }
                }
            }
            let size = disks[disks.length - 1].block * sectors;
            disks[disks.length - 1].partitions.push({ partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot });
        } else if (disks[0] && line[0] == "Units:") {
            disks[disks.length - 1].block = line[5];
        }
    }
    return disks;
}