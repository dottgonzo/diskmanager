const execSync = require("sync-exec");


export interface IPartition {
  partition: string
  sectors: number
  sectors_start: number
  sectors_stop: number
  type: string
  boot: boolean
  size: number
  label?: string
  name: string
  humansize: string
  used: string
  available: string
  percentused: string
  mounted: string
  UUID: string
  disk:string
}

export interface IDisk {
  disk: string
  sectors: number
  size: number;
  partitions: IPartition[]
  block: number
  used_blocks: number
}



export function device(disk: string): IDisk {
  for (let i = 0; i < all().length; i++) {
    if (all()[i].disk === disk) return all()[i]
  }
  throw new Error('not founded')
}


export function partitionFromUuid(uuid: string): IPartition | false {
  const allDisks = all()
  for (let i = 0; i < allDisks.length; i++) {
    for (let ii = 0; ii < allDisks[i].partitions.length; ii++) {
      if (allDisks[i].partitions[ii].UUID === uuid) return allDisks[i].partitions[ii]
    }
  }
  return false
}


export function listAvailablePartitions(): IPartition[] {

  const partitions: IPartition[] = []

  const allDisks = all()

  for (let i = 0; i < allDisks.length; i++) {
    for (let ii = 0; ii < allDisks[i].partitions.length; ii++) {
      if (allDisks[i].partitions[ii].UUID && allDisks[i].partitions[ii].type!=='Extended') partitions.push(allDisks[i].partitions[ii])
    }
  }

  return partitions


}


export function listPartitions(): IPartition[] {

  const partitions: IPartition[] = []

  const allDisks = all()

  for (let i = 0; i < allDisks.length; i++) {
    for (let ii = 0; ii < allDisks[i].partitions.length; ii++) {
      if (allDisks[i].partitions[ii].UUID) partitions.push(allDisks[i].partitions[ii])
    }
  }

  return partitions


}

export function all(): IDisk[] {

  const blkidlines = execSync("sudo blkid").stdout.split("\n");

  const cmd = "sudo fdisk -l";
  const fdi = execSync(cmd).stdout.split("\n");
  const disks = <IDisk[]>[];
  for (let i = 0; i < fdi.length; i++) {
    const line: string[] = fdi[i].replace(/ +(?= )/g, "").split(" ");
    if (fdi[i].split("/dev/ram").length < 2 && fdi[i].split("isk /").length > 1) {

      const disk = line[1].replace(":", "");
      const sectors = parseInt(line[6]);
      const size = parseInt(line[4]);
      disks.push({ disk: disk, sectors: sectors, size: size, partitions: <IPartition[]>[], block: 512, used_blocks: null });
    } else if (disks[0] && fdi[i].split(":").length < 2 && fdi[i].split("dev/").length > 1 && line.length > 1) {

      let uuid;
      let label;
      let labelexists = false;
      for (let b = 0; b < blkidlines.length; b++) {
        let bline = blkidlines[b].replace(/ +(?= )/g, "").split(" ")

        if (bline[0] === line[0] + ":") {
          for (let bl = 0; bl < bline.length; bl++) {
            if (bline[bl].split('ABEL="').length > 1 && bline[bl].split('ABEL="')[1].split('"')[0].split(":").length < 2) {
              labelexists = true;
              label = bline[bl].split('ABEL="')[1].split('"')[0]
            }
            if (bline[bl].split('UID="').length > 1 && bline[bl].split('ARTUUID="').length < 2 && bline[bl].split('UID="')[1].split('"')[0].split(":").length < 2) {
              uuid = bline[bl].split('UID="')[1].split('"')[0]
            }
          }
        }
      }


      const partition = line[0];
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





      const size = disks[disks.length - 1].block * sectors;

      let DISK: IPartition;
      if (labelexists) {
        DISK = { UUID: uuid, disk: disks[disks.length - 1].disk, label: label, name: partition.split('/')[partition.split('/').length - 1], partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot, mounted: '', percentused: '', used: '', available: '', humansize: '' }
      } else {
        DISK = { UUID: uuid, disk: disks[disks.length - 1].disk, partition: partition, name: partition.split('/')[partition.split('/').length - 1], sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot, mounted: '', percentused: '', used: '', available: '', humansize: '' }
      }


      const diskutilization = execSync("df -BM --no-sync").stdout.split("\n");


      for (var du = 0; du < diskutilization.length; du++) {
        const row = diskutilization[du].replace(/ +(?= )/g, "").split(" ")
        if (row[0] === partition) {
          DISK.humansize = row[1]
          DISK.available = row[3]
          DISK.used = row[2]
          DISK.percentused = row[4]
          DISK.mounted = row[5]

        }
      }



      disks[disks.length - 1].partitions.push(DISK);
    } else if (disks[0] && line[0] === "Units:") {
      disks[disks.length - 1].block = parseInt(line[5]);
    }
  }


  for (let i = 0; i < disks.length; i++) {
    if (disks[i].partitions.length > 0) {
      disks[i].used_blocks = disks[i].partitions[disks[i].partitions.length - 1].sectors_stop;
    }
  }

  return disks;
}
