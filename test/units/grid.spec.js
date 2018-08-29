let fs = require('fs');
let grid = fs.readFileSync('yose/static/grid.js').toString();
let source = `
    let Vue = {
        extend: function(options) { return options.methods; }
    };
    `
    + grid + ' return grid;';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let expect = require('chai').expect;

describe('playing', ()=>{

    let sut;
    let document;
    beforeEach(()=>{
        sut = (new Function(source))();
        document = new JSDOM(`
            <div id="cell-1x1"></div><div id="cell-1x2"></div><div id="cell-1x3"></div>
            <div id="cell-2x1"></div><div id="cell-2x2"></div><div id="cell-2x3"></div>            
        `).window.document;
        document.grid = [
            [ 'empty', 'bomb', 'bomb' ],
            [ 'bomb', 'empty', 'empty' ]
        ];
        sut.digest(document);
    });
    it('is dangerous', ()=>{
        let cell = sut.play(1, 2);

        expect(cell.className).to.equal('cell lost');
    });
    it('can be safe', ()=>{
        let cell = sut.play(1, 1);

        expect(cell.className).to.equal('cell safe surrounded-by-1');
    });

    it('reveals surrounding bomb count when safe', ()=>{
        let cell = sut.play(2, 2);

        expect(cell.innerHTML).to.equal('3');
    });
});