// Mouse
var mouseX = 0;
var mouseY = 0;
//#region 
/** Gives a random number between 0 and max
 * @param {number} max 
 * @returns Random Number
 */
function r(max) { return Math.floor(Math.random() * max); }
/** Stores Objects in Local Storage
 * @param {string} key 
 * @param {object} value 
 */
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

/** Retrives Stored Objects
 * @param {string} key 
 * @returns Stored Object
 */
Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
//#endregion

// const particle_min = document.getElementById('particle_min');
// const particle_max = document.getElementById('particle_max');
const particles_total = document.getElementById('particles');
const colors          = document.getElementById('colors');
const time            = document.getElementById('time');
const size            = document.getElementById('size');

const allInputs       = document.querySelectorAll('input');
allInputs.forEach(element => {
    element.addEventListener('change', () => {
        save();
    });
});
var savedata = {
    particles_total: 0,
    colors: 'red',
    time: 0,
    size: 0,
}
// Save
function save() {
    savedata.particles_total    = particles_total.value;
    savedata.colors             = colors.value;
    savedata.time               = time.value;
    savedata.size               = size.value;
    localStorage.setObject('savedata', savedata);
}
// Load
if(localStorage.getItem('savedata') != undefined) {
    savedata = localStorage.getObject('savedata');
    particles_total.value   = savedata.particles_total;
    colors.value            = savedata.colors;
    time.value              = savedata.time;
    size.value              = savedata.size;
}



// Container
const mcContainer = document.getElementById('mouse_confetti');
// Mouse confetti
const confettiColors =  ['red', 'blue', 'cyan', 'purple', 'yellow'];
const ccGold =          ['goldenrod', 'yellow', 'white', '#e1cfa4', '#dcb276', '#be7e4e'];
const ccWhite =         ['white'];
const ccCarrot =        ['#ed9645', '#c3580d', '#de5a01', '#974810'];

mcContainer.addEventListener('click', () => {
    mouseConfetti(
        [
            parseInt(particles_total.value),
            parseInt(particles_total.value)
        ],
        colors.value.split(', '),
        parseInt(time.value),
        parseInt(size.value),
    );
});


/** Confetti effect at mouse position
 * @param {array} particles Array [0] is the minimum amount of particles, [1] is the maximum.
 * @param {array} colorArray Array to pull random colors from
 * @param {number} time Particle lifespan in milliseconds. Will also effect the travel distance of the particles.
 * @returns 
*/
function mouseConfetti(particles=[5,5], colorArray=confettiColors, time=150, size_min=4) {
    console.log(`mouseConfetti(${particles}, ${colorArray}, ${time}, ${size_min})`);
    let count = r(particles[1] - particles[0] + 1) + particles[0] - 1;
    // console.log('mouse confetti!');
    for(i = 0; i < count; i++) {
        // Random attributes
        let color   = colorArray[r(colorArray.length)];
        let rot     = r(360);
        let skew    = r(100) - 50;
        let size    = r(4) + size_min;
        // let distance = r(32) + 24;
        let distance = r(32 * time / 150) + 24 * time / 150;
        let lifespan = r(time) + time; // also effects speed
        // console.log(color, rot, skew, size, distance);

        // Create
        let confetti = document.createElement('div');
        // console.log(confetti);
        confetti.classList.add('small_confetti');
        confetti.style.top = `${mouseY}px`;
        confetti.style.left = `${mouseX}px`;
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
    
        confetti.style.transitionDuration = `${lifespan}ms`;
        confetti.style.transform = `skewX(${skew}deg) rotate(${rot}deg)`;

        mcContainer.append(confetti);

        // Animate
        setTimeout(() => {
            confetti.style.transform = `skewX(${skew}deg) rotate(${rot}deg) translateY(${distance}px)`; 
        }, 20);
        setTimeout(() => {
            confetti.remove();
        }, lifespan);
    }
}

(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
})();