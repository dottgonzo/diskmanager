"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var disks = require("../index");
var expect = chai.expect;
describe('ls disk', function () {
    this.timeout(20000);
    describe('list disks as array', function () {
        it('will return ann array of disks', function () {
            expect(disks.all()).to.an.array;
        });
    });
    describe('list partitions as array', function () {
        it('will return ann array of partitions', function () {
            expect(disks.all()[0].partitions).to.an.array;
        });
    });
    describe('check properties for partitions', function () {
        it('partition must have UUID', function () {
            expect(disks.all()[0].partitions[0]).to.have.property('UUID');
        });
    });
    describe('listpartitions', function () {
        it('list all partitions', function () {
            expect(disks.listPartitions()).to.be.an('Array');
        });
    });
    describe('listavailablepartitions', function () {
        it('list available partitions', function () {
            console.log(JSON.stringify(disks.listAvailablePartitions()));
            expect(disks.listAvailablePartitions()).to.be.an('Array');
        });
    });
    describe('check properties by UUID', function () {
        it('find a partition by UUID', function () {
            expect(disks.partitionFromUuid('f1a15224-37e2-47ba1360bb')).to.have.property('UUID');
        });
    });
    describe('checkfolder', function () {
        it('check folder stats', function () {
            expect(disks.FolderStat('/home')).to.have.property('mounted');
            console.log(disks.FolderStat('/home'));
        });
    });
});
