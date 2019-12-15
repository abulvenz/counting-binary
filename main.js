import m from 'mithril';
import { div, h1, svg, rect, g, text, circle } from './tags';

const width = () => innerWidth;
const height = () => innerHeight;

let waiting = 1;
const { pow, random, trunc } = Math;
const use = (value, fn) => fn(value);
const range = (s, e) => {
    const result = [];
    for (let i = s; i < e; i++) {
        result.push(i);
    }
    return result;
};

let active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let next = 0;
let current = 0;

let nextNumber = () => config.isRandom ? trunc(random() * config.max) : ((++next) % (config.max + 1));

let config = {
    max: 31,
    isRandom: true,
    hints: {
        currentLevelIdx: 0,
        levels: [{
                text: 'No hints',
                showPowers: false,
                showHandsums: false
            },
            {
                text: 'Powers',
                showPowers: true,
                showHandsums: false
            },
            {
                text: 'All',
                showPowers: true,
                showHandsums: true
            },
        ],
    }
};

let currentHintLevel = () => config.hints.levels[config.hints.currentLevelIdx];
let showPowers = () => currentHintLevel().showPowers;
let showHandsums = () => currentHintLevel().showHandsums;

next = nextNumber();

setInterval(() => {
    waiting -= config.max > 31 ? .001 : .005;
    if (waiting < 0) {
        waiting = 1;
        active = activeFingers(next);
        current = next;
        next = nextNumber();
        console.log(showPowers())
        console.log(active)
    }
    m.redraw();
}, 10);


let hands = [{
        where: 'left',
        fingers: [{
                name: 'thumb',
                pow: 5,
                lengthScale: .5,
                angle: 20,
                offsetY: 0
            },
            {
                name: 'index',
                pow: 6,
                lengthScale: .95,
                offsetY: 5
            },
            {
                name: 'middle',
                pow: 7,
                lengthScale: 1
            },
            {
                name: 'ring',
                pow: 8,
                lengthScale: .98
            },
            {
                name: 'pinkie',
                pow: 9,
                lengthScale: .7,
                offsetY: 5
            },
        ]
    },
    {
        where: 'right',
        fingers: [{
                name: 'thumb',
                pow: 0,
                lengthScale: .5,
                angle: 20,
                offsetY: 0
            },
            {
                name: 'index',
                pow: 1,
                lengthScale: .95,
                offsetY: 5
            },
            {
                name: 'middle',
                pow: 2,
                lengthScale: 1
            },
            {
                name: 'ring',
                pow: 3,
                lengthScale: .98
            },
            {
                name: 'pinkie',
                pow: 4,
                lengthScale: .7,
                offsetY: 5
            },
        ]
    }
];


const activeFingers = (n, nf = 10) => {
    let result = [];
    let r = n;
    for (let idx = nf; idx > 0; idx--) {
        let a = pow(2, idx - 1);
        if (r >= a) {
            r -= a;
            result.push(1);
        } else {
            result.push(0);
        }
    }
    return result.reverse();
};

m.mount(document.body, {
    view: vnode => {
        return [
            svg({
                    width: width(), // '100vw',
                    height: height(), //'99.533vh',
                    style: 'background-color:black'
                },
                hands.map(
                    (hand, handIdx) =>
                    g({
                        id: hand.where,
                        transform: hand.where === 'right' //
                            ?
                            `translate(${width() - 200},${height() - 200})rotate(-60)scale(.8)` //
                            :
                            `translate(${200},${height() - 200})scale(.8,-.8)rotate(120)`,
                    }, [
                        rect({
                            id: 'arm',
                            x: -25,
                            y: 160,
                            rx: 80,
                            ry: 20,
                            width: 180,
                            height: 260,
                            stroke: 'cyan'
                        }), rect({
                            id: 'arm',
                            x: -25,
                            y: 160,
                            rx: 80,
                            ry: 20,
                            width: 180,
                            height: 50,
                            stroke: 'cyan'
                        }),
                        rect({
                            id: 'arm',
                            x: 20,
                            y: 140,
                            rx: 80,
                            ry: 20,
                            width: 120,
                            height: 60,
                            stroke: 'blue'
                        }),
                        rect({
                            id: 'hand-base',
                            x: 0,
                            y: 0,
                            rx: 80,
                            ry: 20,
                            width: 160,
                            height: 160,
                            stroke: 'blue'
                        }),
                        hand.fingers.map(
                            (finger, fingerIdx) =>
                            use(active[finger.pow], act => g({
                                id: finger.name
                            }, [
                                rect({
                                    x: 160 - fingerIdx * 40,
                                    y: finger.lengthScale * (act ? -200 : 0) + (finger.offsetY || 0),
                                    rx: 20,
                                    ry: 20,
                                    width: 40,
                                    height: finger.lengthScale * (act ? 200 : 100),
                                    stroke: act ? 'green' : 'red',
                                    transform: `rotate(${finger.angle || 0})`
                                }),
                                finger.name !== 'thumb' && !act ?
                                circle({
                                    cx: 160 - fingerIdx * 40 + 20,
                                    cy: finger.lengthScale * 100 - 15 + (finger.offsetY || 0),
                                    r: 15,
                                    stroke: 'red'
                                }) : null,
                                showPowers() ?
                                text({
                                    x: 160 - fingerIdx * 40 + 20,
                                    y: 0,
                                    transform: hand.where === 'left' ?
                                        `scale(-1,1)translate(${2 * (-205 - -fingerIdx * 40 + 20)})` : `scale(1,1)`,
                                    stroke: 'white'
                                }, pow(2, finger.pow)) :
                                null
                            ])))
                    ])),
                g({
                        transform: `translate(30,30)`,
                        onclick: e => config.hints.currentLevelIdx = (config.hints.currentLevelIdx + 1) % config.hints.levels.length
                    },
                    rect({
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 30,
                        stroke: 'green'
                    }),
                    text({ x: 10, y: 20, stroke: 'white' }, currentHintLevel().text),
                ),
                g({
                        transform: `translate(140,30)`,
                        onclick: e => config.max = 31
                    },
                    rect({
                        x: 0,
                        y: 0,
                        width: 50,
                        height: 30,
                        stroke: 'green'
                    }),
                    text({ x: 10, y: 20, stroke: config.max === 31 ? 'white' : 'green' }, '0-31'),
                ),
                g({
                        transform: `translate(190,30)`,
                        onclick: e => config.max = 1023
                    },
                    rect({
                        x: 0,
                        y: 0,
                        width: 75,
                        height: 30,
                        stroke: 'green'
                    }),
                    text({ x: 10, y: 20, stroke: config.max === 1023 ? 'white' : 'green' }, '0-1023'),
                ),
                g({
                        transform: `translate(275,30)`,
                        onclick: e => config.isRandom = true
                    },
                    rect({
                        x: 0,
                        y: 0,
                        width: 80,
                        height: 30,
                        stroke: 'green'
                    }),
                    text({ x: 10, y: 20, stroke: config.isRandom ? 'white' : 'green' }, 'random'),
                ),
                g({
                        transform: `translate(355,30)`,
                        onclick: e => config.isRandom = false
                    },
                    rect({
                        x: 0,
                        y: 0,
                        width: 75,
                        height: 30,
                        stroke: 'green'
                    }),
                    text({ x: 10, y: 20, stroke: !config.isRandom ? 'white' : 'green' }, '++'),
                ),
                text({
                    x: 30,
                    y: 100,
                    stroke: 'white',

                }, 'current: ', current),
                text({
                    x: width() / 2 - 30,
                    y: height() - 200,
                    stroke: 'white',

                }, 'next: ', next),

                showHandsums() ? [text({
                        x: width() / 2 - 30,
                        y: height() - 100,
                        stroke: 'white',

                    }, 'left: ', range(5, 10).map(i => active[i]).map((e, i) => e === 1 ? pow(2, i + 5) : 0).reduce((a, b) => a + b, 0)),
                    text({
                        x: width() / 2 - 30,
                        y: height() - 80,
                        stroke: 'white',

                    }, 'right: ', range(0, 5).map(i => active[i]).map((e, i) => e === 1 ? pow(2, i) : 0).reduce((a, b) => a + b, 0)),
                ] : null,

                rect({
                    x: 5,
                    y: height() - 20,
                    width: waiting * (width() - 10),
                    height: 10,
                    stroke: 'darkgreen',
                    fill: 'green'
                })
            )
        ];
    }
});