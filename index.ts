let execSync = require("sync-exec");


interface IPartition {
    partition: string;
    sectors: number;
    sectors_start: number;
    sectors_stop: number;
    type: string;
    boot: boolean;
    size: number;
}

interface IDisk {
    disk: string;
    sectors: number;
    size: number;
    partitions: IPartition[];
    block: number;
    used_blocks:number;
}




export = {device(device: string) {
    let cmd = "fdisk " + device + " -l";

    let fdi = execSync(cmd).stdout.split("\n");
    let disks = <IDisk[]>[];
    for (let i = 0; i < fdi.length; i++) {
        let line: string[] = fdi[i].replace(/ +(?= )/g, "").split(" ");
        if (fdi[i].split("/dev/ram").length < 2 && fdi[i].split("isk /").length > 1) {

            let disk = line[1].replace(":", "");
            let sectors = parseInt(line[6]);
            let size = parseInt(line[4]);
            disks.push({ disk: disk, sectors: sectors, size: size, partitions: <IPartition[]>[], block: 512, used_blocks:null });
        } else if (disks[0] && fdi[i].split(":").length < 2 && fdi[i].split("dev/").length > 1 && line.length > 1) {

            let partition = line[0];
            let boot;
            let sector_start;
            let sector_stop;
            let sectors;

            let type = "";
            let typeId;

            if (line[1] === "*") {
                boot = true;
                sector_start = parseInt(line[2]);
                sector_stop = parseInt(line[3]);
                sectors = parseInt(line[4]);
                typeId = parseInt(line[6]);
                for (let l = 7; l < line.length; l++) {
                    if (l === line.length - 1) {
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
                for (let l = 6; l < line.length; l++) {
                    if (l === line.length - 1) {
                        type = type + line[l];
                    } else {
                        type = type + line[l] + " ";
                    }
                }
            }
            let size = disks[disks.length - 1].block * sectors;
            disks[disks.length - 1].partitions.push({ partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot });
        } else if (disks[0] && line[0] === "Units:") {
            disks[disks.length - 1].block = parseInt(line[5]);
        }
    }

    disks[0].used_blocks=disks[0].partitions[disks[0].partitions.length-1].sectors_stop;

    return disks[0];

},

all() {

        let cmd = "fdisk -l";
    let fdi = execSync(cmd).stdout.split("\n");
    let disks = <IDisk[]>[];
    for (let i = 0; i < fdi.length; i++) {
        let line: string[] = fdi[i].replace(/ +(?= )/g, "").split(" ");
        if (fdi[i].split("/dev/ram").length < 2 && fdi[i].split("isk /").length > 1) {

            let disk = line[1].replace(":", "");
            let sectors = parseInt(line[6]);
            let size = parseInt(line[4]);
            disks.push({ disk: disk, sectors: sectors, size: size, partitions: <IPartition[]>[], block: 512, used_blocks:null });
        } else if (disks[0] && fdi[i].split(":").length < 2 && fdi[i].split("dev/").length > 1 && line.length > 1) {

            let partition = line[0];
            let boot;
            let sector_start;
            let sector_stop;
            let sectors;

            let type = "";
            let typeId;

            if (line[1] === "*") {
                boot = true;
                sector_start = parseInt(line[2]);
                sector_stop = parseInt(line[3]);
                sectors = parseInt(line[4]);
                typeId = parseInt(line[6]);
                for (let l = 7; l < line.length; l++) {
                    if (l === line.length - 1) {
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
                for (let l = 6; l < line.length; l++) {
                    if (l === line.length - 1) {
                        type = type + line[l];
                    } else {
                        type = type + line[l] + " ";
                    }
                }
            }
            let size = disks[disks.length - 1].block * sectors;
            disks[disks.length - 1].partitions.push({ partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot });
        } else if (disks[0] && line[0] === "Units:") {
            disks[disks.length - 1].block = parseInt(line[5]);
        }
    }


for(let i=0;i<disks.length;i++){
    disks[i].used_blocks=disks[i].partitions[disks[i].partitions.length-1].sectors_stop;
}

    return disks;
}
}