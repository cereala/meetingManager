import '@testing-library/jest-dom'
import ejs from 'ejs'
import path from 'path'
import { JSDOM } from 'jsdom'

const targetFile = path.resolve('./views/welcome.ejs')
ejs.renderFile(targetFile, function(err, str) {
    if(str) {
        let dom, container
        describe('Welcome page', () => {
            beforeEach(() => {
                dom = new JSDOM(str, { runScripts: 'dangerously' })
                container = dom.window.document.body
            })
            test('p should be Create an account or login', () => {
                expect(container.querySelector('p')).toContainHTML('Create an account or login')
            })
        })
    } else {
        console.log(err)
    }
})

const targetFile2 = path.resolve('./views/dashboard.ejs')
let data = {}
data.name = 'name'
data.events = []
data.messages = {}
data.success_msg = "Hi"
data.error_msg = "error"
data.error = 'err'

ejs.renderFile(targetFile2, data, {}, function(err, str) {
    if(str) {
        let dom, container
        describe('Dashboard page', () => {
            beforeEach(() => {
                dom = new JSDOM(str, { runScripts: 'dangerously' })
                container = dom.window.document.body
                const dashboardName = jest.fn().mockReturnValue('Dashboard')
            })
            
            test('title should be Dashboard', () => {
                expect(container.querySelector('h1')).toContainHTML('Dashboard')
            })
            
            test('List of events is empty', () => {
                expect(container.querySelector('#noEvents')).toContainHTML('No upcoming events')
            })

        })
    } else {
        console.log(err)
    }
})

