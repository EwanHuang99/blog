var wisdomsL = [
    'Happiness is the reward we get for living to the highest right we know.',
    'I have no special talent. I am only passionately curious.',
    'To be wrong is nothing unless you continue to remember it.',
    'Things that were hard to bear are sweet to remember.',
    'A contented mind is the greatest blessing a man can enjoy in this world.',
    'That man is the richest whose pleasure are the cheapest.',
    'Sometimes one pays most for the things one gets for nothing.',
    'Will, work and wait are the pyramidal cornerstones for success.',
    'All the splendor in the world is not worth a good friend.',
    'You have to believe in yourself. That\'s the secret of success.',
    'Progress is the activity of today and the assurance of tomorrow.',
    'Our destiny offers not the cup of despair, but the chalice of opportunity.',
    'Miracles sometimes occur, but one has to work terribly for them.',
    'Genius only means hard-working all one\'s life.',
    'You can tell the ideals of a nation by its advertisements.',
    'From small beginnings comes great things.',
    'Money spent on the brain is never spent in vain.',
    'The voice of one man is the voice of no one.',
    'A great ship asks for deep waters.',
    'It takes all sorts to make a world.'
];
var wisdomsS = [
    'Love all, trust a few, do wrong to none.',
    'Begin, be bold, and venture to be wise.',
    'It never will rain roses.',
    'Constant dropping wears the stone.',
    'Experience is the mother of wisdom.',
    'Actions speak louder than words.',
    'From small beginnings comes great things.',
    'The voice of one man is the voice of no one.',
    'A great ship asks for deep waters.',
    'It takes all sorts to make a world.',
    'It is never too late to learn.',
    'It is never too late to mend.',
    'Live and let live.',
    'Better late than never.',
    'A bold attempt is half success.',
    'Work makes the workman.',
    'Murmur, a little sadly, how Love fled',
    'Pain past is pleasure.',
    'Storms make trees take deeper roots.'
];

$(document).ready(function() {
    let banner = document.getElementById('banner');
    if (banner) {
        let width = window.screen.width;
        let i = parseInt((Math.random() * 20 + 1));
        if (width > 768) {
            banner.style.backgroundImage = 'url(/images/bg/bg-lg-' + i + '.jpg)';
        } else {
            banner.style.backgroundImage = 'url(/images/bg/bg-sm-' + i + '.jpg)';
        }

        let wisdom = document.getElementById('wisdom');
        if (wisdom) {
            if (width > 768) {
                wisdom.innerHTML = wisdomsL[i - 1];
            } else {
                wisdom.innerHTML = wisdomsS[i - 1];
            }
        }
    }
})