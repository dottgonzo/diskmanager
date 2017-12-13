import * as chai from "chai"

import * as disks from "../index"

const expect = chai.expect


describe('ls disk', () => {

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




    
})
