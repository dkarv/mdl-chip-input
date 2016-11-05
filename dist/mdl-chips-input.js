$(document).ready(function() {
    var field = $('.mdl-chipfield');
    field.each(function() {
        var field = $(this);
        field.children().wrapAll('<div class="original"></div>');
        field.prepend('<div class="chips"></div>');
        var chips = field.find('.chips');
        var input = field.find('.mdl-textfield__input');
        var target = field.find('.mdl-chipfield__input');

        function insertChip(text) {
            var html =
                '<span class="mdl-chip mdl-chip--deletable">' +
                '<span class="mdl-chip__text">' + text + '</span>' +
                '<button type="button" class="mdl-chip__action">' +
                '<i class="material-icons">cancel</i></button></span>';
            chips.append(html);
        }

        function getChips() {
            return chips.children().map(function() {
                return $(this).find('.mdl-chip__text').text();
            }).get();
        }

        if(target.val()) {
            // initialize the chips
            target.val().split(',').forEach(insertChip);
        }

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
                        insertChip(content);
                        currentChips.push(content);
                        target.val(currentChips.join(','));
                        field.removeClass('is-dirty');
                    }
                }
            }
            if(e.keyCode === 8 && !input.val()) {
                // remove last tag if input is empty
                chips.children().last().remove();
            }
            return false;
        });
    });

    // remove button
    field.on('click', '.mdl-chip__action', function() {
        $(this).parent().remove();
    });

});
