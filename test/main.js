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
    describe('check properties by UUID', function () {
        it('partition must have UUID', function () {
            expect(disks.partitionFromUuid('f1a15224-37e2-47ba1360bb')).to.have.property('UUID');
        });
    });
});
