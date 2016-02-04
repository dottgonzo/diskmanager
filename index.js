var execSync = require("sync-exec");
module.exports = { device: function (device) {
        var cmd = "fdisk " + device + " -l";
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
                disks[disks.length - 1].partitions.push({ partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot });
            }
            else if (disks[0] && line[0] === "Units:") {
                disks[disks.length - 1].block = parseInt(line[5]);
            }
        }
        disks[0].used_blocks = disks[0].partitions[disks[0].partitions.length - 1].sectors_stop;
        return disks[0];
    },
    all: function () {
        var cmd = "fdisk -l";
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
                disks[disks.length - 1].partitions.push({ partition: partition, sectors_start: sector_start, sectors_stop: sector_stop, sectors: sectors, size: size, type: type, boot: boot });
            }
            else if (disks[0] && line[0] === "Units:") {
                disks[disks.length - 1].block = parseInt(line[5]);
            }
        }
        for (var i = 0; i < disks.length; i++) {
            disks[i].used_blocks = disks[i].partitions[disks[i].partitions.length - 1].sectors_stop;
        }
        return disks;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRldmljZSIsImFsbCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBeUJwQyxpQkFBUyxFQUFDLE1BQU0sWUFBQyxNQUFjO1FBQzNCQSxJQUFJQSxHQUFHQSxHQUFHQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVwQ0EsSUFBSUEsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLElBQUlBLEtBQUtBLEdBQVlBLEVBQUVBLENBQUNBO1FBQ3hCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNsQ0EsSUFBSUEsSUFBSUEsR0FBYUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDL0RBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUUxRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BDQSxJQUFJQSxPQUFPQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDaENBLElBQUlBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM3QkEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsT0FBT0EsRUFBRUEsT0FBT0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsVUFBVUEsRUFBZ0JBLEVBQUVBLEVBQUVBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUVBLFdBQVdBLEVBQUNBLElBQUlBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3pIQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFeEdBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4QkEsSUFBSUEsSUFBSUEsU0FBQUEsQ0FBQ0E7Z0JBQ1RBLElBQUlBLFlBQVlBLFNBQUFBLENBQUNBO2dCQUNqQkEsSUFBSUEsV0FBV0EsU0FBQUEsQ0FBQ0E7Z0JBQ2hCQSxJQUFJQSxPQUFPQSxTQUFBQSxDQUFDQTtnQkFFWkEsSUFBSUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ2RBLElBQUlBLE1BQU1BLFNBQUFBLENBQUNBO2dCQUVYQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbEJBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO29CQUNaQSxZQUFZQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakNBLFdBQVdBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNoQ0EsT0FBT0EsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3hCQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDMUJBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDSkEsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ2hDQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7Z0JBRUxBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBQ2JBLFlBQVlBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNqQ0EsV0FBV0EsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2hDQSxPQUFPQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDeEJBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMxQkEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNKQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTt3QkFDaENBLENBQUNBO29CQUNMQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLE9BQU9BLENBQUNBO2dCQUNuREEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEsWUFBWUEsRUFBRUEsWUFBWUEsRUFBRUEsV0FBV0EsRUFBRUEsT0FBT0EsRUFBRUEsT0FBT0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDcExBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdERBLENBQUNBO1FBQ0xBLENBQUNBO1FBRURBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBO1FBRXBGQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUVwQkEsQ0FBQ0E7SUFFRCxHQUFHO1FBRUtDLElBQUlBLEdBQUdBLEdBQUdBLFVBQVVBLENBQUNBO1FBQ3pCQSxJQUFJQSxHQUFHQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMzQ0EsSUFBSUEsS0FBS0EsR0FBWUEsRUFBRUEsQ0FBQ0E7UUFDeEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ2xDQSxJQUFJQSxJQUFJQSxHQUFhQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUMvREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTFFQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDcENBLElBQUlBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQ0EsSUFBSUEsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdCQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxPQUFPQSxFQUFFQSxPQUFPQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFnQkEsRUFBRUEsRUFBRUEsS0FBS0EsRUFBRUEsR0FBR0EsRUFBRUEsV0FBV0EsRUFBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDekhBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLENBQUNB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SUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzFCQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ0pBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNoQ0EsQ0FBQ0E7b0JBQ0xBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFDREEsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsT0FBT0EsQ0FBQ0E7Z0JBQ25EQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxhQUFhQSxFQUFFQSxZQUFZQSxFQUFFQSxZQUFZQSxFQUFFQSxXQUFXQSxFQUFFQSxPQUFPQSxFQUFFQSxPQUFPQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNwTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0REEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFHTEEsR0FBR0EsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBQ0EsQ0FBQ0EsRUFBRUEsRUFBQ0EsQ0FBQ0E7WUFDNUJBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBO1FBQ3hGQSxDQUFDQTtRQUVHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNqQkEsQ0FBQ0E7Q0FDQSxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGV4ZWNTeW5jID0gcmVxdWlyZShcInN5bmMtZXhlY1wiKTtcblxuXG5pbnRlcmZhY2UgSVBhcnRpdGlvbiB7XG4gICAgcGFydGl0aW9uOiBzdHJpbmc7XG4gICAgc2VjdG9yczogbnVtYmVyO1xuICAgIHNlY3RvcnNfc3RhcnQ6IG51bWJlcjtcbiAgICBzZWN0b3JzX3N0b3A6IG51bWJlcjtcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgYm9vdDogYm9vbGVhbjtcbiAgICBzaXplOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJRGlzayB7XG4gICAgZGlzazogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgcGFydGl0aW9uczogSVBhcnRpdGlvbltdO1xuICAgIGJsb2NrOiBudW1iZXI7XG4gICAgdXNlZF9ibG9ja3M6bnVtYmVyO1xufVxuXG5cblxuXG5leHBvcnQgPSB7ZGV2aWNlKGRldmljZTogc3RyaW5nKSB7XG4gICAgbGV0IGNtZCA9IFwiZmRpc2sgXCIgKyBkZXZpY2UgKyBcIiAtbFwiO1xuXG4gICAgbGV0IGZkaSA9IGV4ZWNTeW5jKGNtZCkuc3Rkb3V0LnNwbGl0KFwiXFxuXCIpO1xuICAgIGxldCBkaXNrcyA9IDxJRGlza1tdPltdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmRpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBsaW5lOiBzdHJpbmdbXSA9IGZkaVtpXS5yZXBsYWNlKC8gKyg/PSApL2csIFwiXCIpLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaWYgKGZkaVtpXS5zcGxpdChcIi9kZXYvcmFtXCIpLmxlbmd0aCA8IDIgJiYgZmRpW2ldLnNwbGl0KFwiaXNrIC9cIikubGVuZ3RoID4gMSkge1xuXG4gICAgICAgICAgICBsZXQgZGlzayA9IGxpbmVbMV0ucmVwbGFjZShcIjpcIiwgXCJcIik7XG4gICAgICAgICAgICBsZXQgc2VjdG9ycyA9IHBhcnNlSW50KGxpbmVbNl0pO1xuICAgICAgICAgICAgbGV0IHNpemUgPSBwYXJzZUludChsaW5lWzRdKTtcbiAgICAgICAgICAgIGRpc2tzLnB1c2goeyBkaXNrOiBkaXNrLCBzZWN0b3JzOiBzZWN0b3JzLCBzaXplOiBzaXplLCBwYXJ0aXRpb25zOiA8SVBhcnRpdGlvbltdPltdLCBibG9jazogNTEyLCB1c2VkX2Jsb2NrczpudWxsIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRpc2tzWzBdICYmIGZkaVtpXS5zcGxpdChcIjpcIikubGVuZ3RoIDwgMiAmJiBmZGlbaV0uc3BsaXQoXCJkZXYvXCIpLmxlbmd0aCA+IDEgJiYgbGluZS5sZW5ndGggPiAxKSB7XG5cbiAgICAgICAgICAgIGxldCBwYXJ0aXRpb24gPSBsaW5lWzBdO1xuICAgICAgICAgICAgbGV0IGJvb3Q7XG4gICAgICAgICAgICBsZXQgc2VjdG9yX3N0YXJ0O1xuICAgICAgICAgICAgbGV0IHNlY3Rvcl9zdG9wO1xuICAgICAgICAgICAgbGV0IHNlY3RvcnM7XG5cbiAgICAgICAgICAgIGxldCB0eXBlID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0eXBlSWQ7XG5cbiAgICAgICAgICAgIGlmIChsaW5lWzFdID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGJvb3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlY3Rvcl9zdGFydCA9IHBhcnNlSW50KGxpbmVbMl0pO1xuICAgICAgICAgICAgICAgIHNlY3Rvcl9zdG9wID0gcGFyc2VJbnQobGluZVszXSk7XG4gICAgICAgICAgICAgICAgc2VjdG9ycyA9IHBhcnNlSW50KGxpbmVbNF0pO1xuICAgICAgICAgICAgICAgIHR5cGVJZCA9IHBhcnNlSW50KGxpbmVbNl0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSA3OyBsIDwgbGluZS5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobCA9PT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSArIGxpbmVbbF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSArIGxpbmVbbF0gKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib290ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VjdG9yX3N0YXJ0ID0gcGFyc2VJbnQobGluZVsxXSk7XG4gICAgICAgICAgICAgICAgc2VjdG9yX3N0b3AgPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgICAgICAgICBzZWN0b3JzID0gcGFyc2VJbnQobGluZVszXSk7XG4gICAgICAgICAgICAgICAgdHlwZUlkID0gcGFyc2VJbnQobGluZVs1XSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IDY7IGwgPCBsaW5lLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlICsgbGluZVtsXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlICsgbGluZVtsXSArIFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHNpemUgPSBkaXNrc1tkaXNrcy5sZW5ndGggLSAxXS5ibG9jayAqIHNlY3RvcnM7XG4gICAgICAgICAgICBkaXNrc1tkaXNrcy5sZW5ndGggLSAxXS5wYXJ0aXRpb25zLnB1c2goeyBwYXJ0aXRpb246IHBhcnRpdGlvbiwgc2VjdG9yc19zdGFydDogc2VjdG9yX3N0YXJ0LCBzZWN0b3JzX3N0b3A6IHNlY3Rvcl9zdG9wLCBzZWN0b3JzOiBzZWN0b3JzLCBzaXplOiBzaXplLCB0eXBlOiB0eXBlLCBib290OiBib290IH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRpc2tzWzBdICYmIGxpbmVbMF0gPT09IFwiVW5pdHM6XCIpIHtcbiAgICAgICAgICAgIGRpc2tzW2Rpc2tzLmxlbmd0aCAtIDFdLmJsb2NrID0gcGFyc2VJbnQobGluZVs1XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNrc1swXS51c2VkX2Jsb2Nrcz1kaXNrc1swXS5wYXJ0aXRpb25zW2Rpc2tzWzBdLnBhcnRpdGlvbnMubGVuZ3RoLTFdLnNlY3RvcnNfc3RvcDtcblxuICAgIHJldHVybiBkaXNrc1swXTtcblxufSxcblxuYWxsKCkge1xuXG4gICAgICAgIGxldCBjbWQgPSBcImZkaXNrIC1sXCI7XG4gICAgbGV0IGZkaSA9IGV4ZWNTeW5jKGNtZCkuc3Rkb3V0LnNwbGl0KFwiXFxuXCIpO1xuICAgIGxldCBkaXNrcyA9IDxJRGlza1tdPltdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmRpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBsaW5lOiBzdHJpbmdbXSA9IGZkaVtpXS5yZXBsYWNlKC8gKyg/PSApL2csIFwiXCIpLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaWYgKGZkaVtpXS5zcGxpdChcIi9kZXYvcmFtXCIpLmxlbmd0aCA8IDIgJiYgZmRpW2ldLnNwbGl0KFwiaXNrIC9cIikubGVuZ3RoID4gMSkge1xuXG4gICAgICAgICAgICBsZXQgZGlzayA9IGxpbmVbMV0ucmVwbGFjZShcIjpcIiwgXCJcIik7XG4gICAgICAgICAgICBsZXQgc2VjdG9ycyA9IHBhcnNlSW50KGxpbmVbNl0pO1xuICAgICAgICAgICAgbGV0IHNpemUgPSBwYXJzZUludChsaW5lWzRdKTtcbiAgICAgICAgICAgIGRpc2tzLnB1c2goeyBkaXNrOiBkaXNrLCBzZWN0b3JzOiBzZWN0b3JzLCBzaXplOiBzaXplLCBwYXJ0aXRpb25zOiA8SVBhcnRpdGlvbltdPltdLCBibG9jazogNTEyLCB1c2VkX2Jsb2NrczpudWxsIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRpc2tzWzBdICYmIGZkaVtpXS5zcGxpdChcIjpcIikubGVuZ3RoIDwgMiAmJiBmZGlbaV0uc3BsaXQoXCJkZXYvXCIpLmxlbmd0aCA+IDEgJiYgbGluZS5sZW5ndGggPiAxKSB7XG5cbiAgICAgICAgICAgIGxldCBwYXJ0aXRpb24gPSBsaW5lWzBdO1xuICAgICAgICAgICAgbGV0IGJvb3Q7XG4gICAgICAgICAgICBsZXQgc2VjdG9yX3N0YXJ0O1xuICAgICAgICAgICAgbGV0IHNlY3Rvcl9zdG9wO1xuICAgICAgICAgICAgbGV0IHNlY3RvcnM7XG5cbiAgICAgICAgICAgIGxldCB0eXBlID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0eXBlSWQ7XG5cbiAgICAgICAgICAgIGlmIChsaW5lWzFdID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGJvb3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlY3Rvcl9zdGFydCA9IHBhcnNlSW50KGxpbmVbMl0pO1xuICAgICAgICAgICAgICAgIHNlY3Rvcl9zdG9wID0gcGFyc2VJbnQobGluZVszXSk7XG4gICAgICAgICAgICAgICAgc2VjdG9ycyA9IHBhcnNlSW50KGxpbmVbNF0pO1xuICAgICAgICAgICAgICAgIHR5cGVJZCA9IHBhcnNlSW50KGxpbmVbNl0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSA3OyBsIDwgbGluZS5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobCA9PT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSArIGxpbmVbbF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSArIGxpbmVbbF0gKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib290ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VjdG9yX3N0YXJ0ID0gcGFyc2VJbnQobGluZVsxXSk7XG4gICAgICAgICAgICAgICAgc2VjdG9yX3N0b3AgPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgICAgICAgICBzZWN0b3JzID0gcGFyc2VJbnQobGluZVszXSk7XG4gICAgICAgICAgICAgICAgdHlwZUlkID0gcGFyc2VJbnQobGluZVs1XSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IDY7IGwgPCBsaW5lLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlICsgbGluZVtsXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlICsgbGluZVtsXSArIFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHNpemUgPSBkaXNrc1tkaXNrcy5sZW5ndGggLSAxXS5ibG9jayAqIHNlY3RvcnM7XG4gICAgICAgICAgICBkaXNrc1tkaXNrcy5sZW5ndGggLSAxXS5wYXJ0aXRpb25zLnB1c2goeyBwYXJ0aXRpb246IHBhcnRpdGlvbiwgc2VjdG9yc19zdGFydDogc2VjdG9yX3N0YXJ0LCBzZWN0b3JzX3N0b3A6IHNlY3Rvcl9zdG9wLCBzZWN0b3JzOiBzZWN0b3JzLCBzaXplOiBzaXplLCB0eXBlOiB0eXBlLCBib290OiBib290IH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRpc2tzWzBdICYmIGxpbmVbMF0gPT09IFwiVW5pdHM6XCIpIHtcbiAgICAgICAgICAgIGRpc2tzW2Rpc2tzLmxlbmd0aCAtIDFdLmJsb2NrID0gcGFyc2VJbnQobGluZVs1XSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuZm9yKGxldCBpPTA7aTxkaXNrcy5sZW5ndGg7aSsrKXtcbiAgICBkaXNrc1tpXS51c2VkX2Jsb2Nrcz1kaXNrc1tpXS5wYXJ0aXRpb25zW2Rpc2tzW2ldLnBhcnRpdGlvbnMubGVuZ3RoLTFdLnNlY3RvcnNfc3RvcDtcbn1cblxuICAgIHJldHVybiBkaXNrcztcbn1cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
