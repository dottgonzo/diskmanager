var execSync = require("sync-exec");
module.exports = function (device) {
    var cmd;
    if (device) {
        cmd = "fdisk " + device + " -l";
    }
    else {
        cmd = "fdisk -l";
    }
    var fdi = execSync(cmd).stdout.split("\n");
    var disks = [];
    for (var i = 0; i < fdi.length; i++) {
        var line = fdi[i].replace(/ +(?= )/g, "").split(" ");
        if (fdi[i].split("/dev/ram").length < 2 && fdi[i].split("isk /").length > 1) {
            var disk = line[1].replace(":", "");
            var sectors = parseInt(line[6]);
            var size = parseInt(line[4]);
            disks.push({ disk: disk, sectors: sectors, size: size, partitions: [] });
        }
        else if (disks[0] && fdi[i].split(":").length < 2 && fdi[i].split("dev/").length > 1 && line.length > 1) {
            var partition = line[0];
            var boot = void 0;
            var sector_start = void 0;
            var sector_stop = void 0;
            var sectors = void 0;
            var type = "";
            var typeId = void 0;
            if (line[1] == "*") {
                boot = true;
                sector_start = parseInt(line[2]);
                sector_stop = parseInt(line[3]);
                sectors = parseInt(line[4]);
                typeId = parseInt(line[6]);
                for (var l = 7; l < line.length; l++) {
                    if (l == line.length - 1) {
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
                    if (l == line.length - 1) {
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
        else if (disks[0] && line[0] == "Units:") {
            disks[disks.length - 1].block = line[5];
        }
    }
    return disks;
};

//# sourceMappingURL=data:application/json;base64,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SSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ2hDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ25ELEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6QyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNqQixDQUFDLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmxldCBleGVjU3luYyA9IHJlcXVpcmUoXCJzeW5jLWV4ZWNcIik7XG5leHBvcnQgPSBmdW5jdGlvbihkZXZpY2U/OiBzdHJpbmcpIHtcbiAgICBsZXQgY21kO1xuICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgY21kID0gXCJmZGlzayBcIiArIGRldmljZSArIFwiIC1sXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY21kID0gXCJmZGlzayAtbFwiO1xuICAgIH1cbiAgICB2YXIgZmRpID0gZXhlY1N5bmMoY21kKS5zdGRvdXQuc3BsaXQoXCJcXG5cIik7XG4gICAgbGV0IGRpc2tzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmZGkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGxpbmUgPSBmZGlbaV0ucmVwbGFjZSgvICsoPz0gKS9nLCBcIlwiKS5zcGxpdChcIiBcIik7XG4gICAgICAgIGlmIChmZGlbaV0uc3BsaXQoXCIvZGV2L3JhbVwiKS5sZW5ndGggPCAyICYmIGZkaVtpXS5zcGxpdChcImlzayAvXCIpLmxlbmd0aCA+IDEpIHtcblxuICAgICAgICAgICAgbGV0IGRpc2sgPSBsaW5lWzFdLnJlcGxhY2UoXCI6XCIsIFwiXCIpO1xuICAgICAgICAgICAgbGV0IHNlY3RvcnMgPSBwYXJzZUludChsaW5lWzZdKTtcbiAgICAgICAgICAgIGxldCBzaXplID0gcGFyc2VJbnQobGluZVs0XSk7XG4gICAgICAgICAgICBkaXNrcy5wdXNoKHsgZGlzazogZGlzaywgc2VjdG9yczogc2VjdG9ycywgc2l6ZTogc2l6ZSwgcGFydGl0aW9uczogW10gfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlza3NbMF0gJiYgZmRpW2ldLnNwbGl0KFwiOlwiKS5sZW5ndGggPCAyICYmIGZkaVtpXS5zcGxpdChcImRldi9cIikubGVuZ3RoID4gMSAmJiBsaW5lLmxlbmd0aCA+IDEpIHtcblxuICAgICAgICAgICAgbGV0IHBhcnRpdGlvbiA9IGxpbmVbMF07XG4gICAgICAgICAgICBsZXQgYm9vdDtcbiAgICAgICAgICAgIGxldCBzZWN0b3Jfc3RhcnQ7XG4gICAgICAgICAgICBsZXQgc2VjdG9yX3N0b3A7XG4gICAgICAgICAgICBsZXQgc2VjdG9ycztcblxuICAgICAgICAgICAgbGV0IHR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHR5cGVJZDtcblxuICAgICAgICAgICAgaWYgKGxpbmVbMV0gPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBib290ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZWN0b3Jfc3RhcnQgPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgICAgICAgICBzZWN0b3Jfc3RvcCA9IHBhcnNlSW50KGxpbmVbM10pO1xuICAgICAgICAgICAgICAgIHNlY3RvcnMgPSBwYXJzZUludChsaW5lWzRdKTtcbiAgICAgICAgICAgICAgICB0eXBlSWQgPSBwYXJzZUludChsaW5lWzZdKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBsID0gNzsgbCA8IGxpbmUubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGwgPT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSArIGxpbmVbbF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSArIGxpbmVbbF0gKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib290ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VjdG9yX3N0YXJ0ID0gcGFyc2VJbnQobGluZVsxXSk7XG4gICAgICAgICAgICAgICAgc2VjdG9yX3N0b3AgPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgICAgICAgICBzZWN0b3JzID0gcGFyc2VJbnQobGluZVszXSk7XG4gICAgICAgICAgICAgICAgdHlwZUlkID0gcGFyc2VJbnQobGluZVs1XSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IDY7IGwgPCBsaW5lLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsID09IGxpbmUubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHR5cGUgKyBsaW5lW2xdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHR5cGUgKyBsaW5lW2xdICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc2l6ZSA9IGRpc2tzW2Rpc2tzLmxlbmd0aCAtIDFdLmJsb2NrICogc2VjdG9ycztcbiAgICAgICAgICAgIGRpc2tzW2Rpc2tzLmxlbmd0aCAtIDFdLnBhcnRpdGlvbnMucHVzaCh7IHBhcnRpdGlvbjogcGFydGl0aW9uLCBzZWN0b3JzX3N0YXJ0OiBzZWN0b3Jfc3RhcnQsIHNlY3RvcnNfc3RvcDogc2VjdG9yX3N0b3AsIHNlY3RvcnM6IHNlY3RvcnMsIHNpemU6IHNpemUsIHR5cGU6IHR5cGUsIGJvb3Q6IGJvb3QgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlza3NbMF0gJiYgbGluZVswXSA9PSBcIlVuaXRzOlwiKSB7XG4gICAgICAgICAgICBkaXNrc1tkaXNrcy5sZW5ndGggLSAxXS5ibG9jayA9IGxpbmVbNV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpc2tzO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
