import * as chai from "chai"

import * as disks from "../index"

const expect = chai.expect


describe('ls disk', function() {
this.timeout(20000)
    describe('list disks as array', () => {

        it('will return ann array of disks', () => {
            expect(disks.all()).to.an.array
        })
    })


    describe('list partitions as array', () => {
        
                it('will return ann array of partitions', () => {
                    expect(disks.all()[0].partitions).to.an.array
                })
            })


    describe('check properties for partitions', () => {

        it('partition must have UUID', () => {
            expect(disks.all()[0].partitions[0]).to.have.property('UUID')
        })




    })


    describe('listpartitions', () => {

        it('list all partitions', () => {
            expect(disks.listPartitions()).to.be.an('Array')
        })
    })


    describe('listavailablepartitions', () => {

        it('list available partitions', () => {
            console.log(JSON.stringify(disks.listAvailablePartitions()))
            expect(disks.listAvailablePartitions()).to.be.an('Array')
        })
    })

    describe('check properties by UUID', () => {

        it('find a partition by UUID', () => {

            expect(disks.partitionFromUuid('f1a15224-37e2-47ba1360bb')).to.have.property('UUID')
        })




    })


    
})
