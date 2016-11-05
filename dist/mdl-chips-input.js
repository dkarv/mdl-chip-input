$.fn.chips_input = function(options) {
    var objs = { field: $(this) };
    objs.field.addClass('mdl-chipfield');
    objs.field.children().wrapAll('<div class="original"></div>');
    objs.field.prepend('<div class="chips"></div>');
    objs.chips = objs.field.find('.chips');
    objs.input = objs.field.find('.mdl-textfield__input');
    objs.target = objs.field.find('.mdl-chipfield__input');
    if(options.search) {
        objs.results = $('<ul class="results"></ul>').insertAfter(objs.input);
    }

    function insertChip(text) {
        var html =
            '<span class="mdl-chip mdl-chip--deletable">' +
            '<span class="mdl-chip__text">' + text + '</span>' +
            '<button type="button" class="mdl-chip__action">' +
            '<i class="material-icons">cancel</i></button></span>';
        objs.chips.append(html);
    }

    function getChips() {
        return objs.chips.children().map(function() {
            return $(this).find('.mdl-chip__text').text();
        }).get();
    }

    if(objs.target.val()) {
        // initialize the chips
        objs.target.val().split(',').forEach(insertChip);
    }

    objs.input.on('keydown', function(e) {
        if(e.keyCode === 8 && !objs.input.val()) {
            // remove last tag if input is empty
            objs.chips.children().last().remove();
        }
        return e.keyCode !== 13;
    });
    objs.input.on('keyup', function(e) {
        if([13, 32, 188].indexOf(e.keyCode) > -1) {
            var content = objs.input.val().replace(/[^0-9a-zäüö]/gi, '');
            if(content) {
                objs.input.val('');
                var currentChips = getChips();
                if(currentChips.indexOf(content) === -1) {
                    insertChip(content);
                    currentChips.push(content);
                    objs.target.val(currentChips.join(','));
                    objs.field.removeClass('is-dirty');
                }
            }
        } else {
            if(options.search) {
                var query = objs.input.val();
                options.search(query, function(result) {
                    console.log(result);
                    objs.results.empty();
                    result.forEach(function(res) {
                        // highlight the search results
                        objs.results.append("<li>" + res + "</li>");
                    })
                });
            }
        }
        return false;
    });
    if(options.search) {
        objs.results.on('click', 'li', function() {
            var text = $(this).text();
            if(getChips().indexOf(text) === -1) {
                insertChip(text);
            }
            objs.results.empty();
            objs.input.val('');
        });
    }
    // remove button
    objs.field.on('click', '.mdl-chip__action', function() {
        $(this).parent().remove();
    });
};


$(document).ready(function() {
    $('#demo-0').chips_input({});
    $('#demo-1').chips_input({});
    $('#demo-2').chips_input({
        search: function(query, callback) {
            var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
            callback($.grep(countries, function(item) {
                return item.search(new RegExp(query, "i")) != -1;
            }));
        }
    });


});
