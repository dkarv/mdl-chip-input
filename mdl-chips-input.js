function createChip(text) {
    return '<span class="mdl-chip mdl-chip--deletable">' + '<span class="mdl-chip__text">' + text + '</span><button type="button" class="mdl-chip__action">' + '<i class="material-icons">cancel</i></button></span>';
}
var field = $('.mdl-chipfield');
field.children().wrapAll('<div class="original"></div>');
field.prepend('<div class="chips"></div>');
field.on('click', '.mdl-chip__action', function() {
    console.log($(this).parent().remove());
});
var chips = field.find('.chips');
function getChips() {
    return chips.children().map(function() {
        return $(this).find('.mdl-chip__text').text();
    }).get();
}
var input = field.find('.mdl-textfield__input');
var target = field.find('.mdl-chipfield__input');
input.on('keydown', function(e) {
    return e.keyCode !== 13;
});
input.on('keyup', function(e) {
    if(e.keyCode === 13 || e.keyCode === 188) {
        var content = input.val().replace(/[^0-9a-zäüö]/gi, '');
        if(content) {
            input.val('');
            var currentChips = getChips();
            if(currentChips.indexOf(content) === -1) {
                chips.append(createChip(content));
                target.val(currentChips.join(','));
            }
        }
    }
    if(e.keyCode === 8 && !input.val()) {
        chips.children().last().remove();
    }
    return false;
});