
let execSync = require("sync-exec");
export = function(){
    var fdi = execSync("fdisk -l|grep '/dev/s'").stdout.split("\n");
    let disks = [];
    for (var i = 0; i < fdi.length; i++) {
        if (fdi[i].split("isk").length > 1) {
            disks.push({ sectors_start: fdi[i].replace(/ +(?= )/g,"").split(" ")[1], disk: fdi[i].replace(/ +(?= )/g,"").split(" ")[1].replace(":",""), sectors:fdi[i].replace(/ +(?= )/g,"").split(" ")[6], size:fdi[i].replace(/ +(?= )/g,"").split(" ")[2].replace(",","."), size_unit:fdi[i].replace(/ +(?= )/g,"").split(" ")[3].replace(",",""), partitions: [] });
        } else {
            let part = { disk: fdi[i].split(" ")[0],sectors_start: fdi[i].replace(/ +(?= )/g,"").split(" ")[1],sectors_stop: fdi[i].replace(/ +(?= )/g,"").split(" ")[2],sectors: fdi[i].replace(/ +(?= )/g,"").split(" ")[3],size: fdi[i].replace(/ +(?= )/g,"").split(" ")[4],typeCode: fdi[i].replace(/ +(?= )/g,"").split(" ")[5] };
            disks[disks.length - 1].partitions.push(part);
        }
    }
    return disks;
}