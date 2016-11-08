(function() {
    'use strict';

    var MaterialChipInput = function MaterialChipInput(element) {
        this.element_ = element;

        this.init();
    };
    window['MaterialChipInput'] = MaterialChipInput;


    MaterialChipInput.prototype.Constant_ = {};
    MaterialChipInput.prototype.CssClasses_ = {};

    MaterialChipInput.prototype.setProgress = function(p) {

    };

    MaterialChipInput.prototype.addChip_ = function(text) {
        var chip = document.createElement('span');
        chip.classList = 'mdl-chip mdl-chip--deletable';
        chip.innerHTML =
            '<span class="mdl-chip__text">' + text + '</span>' +
            '<button type="button" class="mdl-chip__action">' +
            '<i class="material-icons">close</i></button>';
        var update = this.updateTarget_.bind(this);
        chip.getElementsByClassName('mdl-chip__action')[0].onclick = function() {
            console.log('removing', text);
            chip.remove();
            update();
        };
        this.element_.insertBefore(chip, this.inputs_);
    };

    MaterialChipInput.prototype.getChips = function() {
        var currentChips = [];
        var children = this.element_.children;
        for(var i = children.length; i--;) {
            if(children[i].classList.contains('mdl-chip')) {
                currentChips.unshift(
                    children[i].children[0].textContent ||
                    children[i].children[0].innerText);
            }
        }
        return currentChips;
    };

    MaterialChipInput.prototype.updateTarget_ = function() {
        var currentChips = this.getChips();
        this.target_.value = currentChips.join(this.options_.separator);
        if(currentChips.length >= this.options_.maximum) {
            this.input_.style.display = 'none';
        } else {
            this.input_.style.display = 'block';
        }
    };

    MaterialChipInput.prototype.startSearch_ = function() {
        if(this.results_) {
            var query = this.input_.value;
            this.search(query, function(result) {
                console.log(result);
                this.results_.innerHTML = result.map(function(res) {
                    return '<li>' + res + '</li>';
                }).join('\n');
            });
        }
    };

    MaterialChipInput.prototype.clearResults_ = function() {
        if(this.results_) {
            for(var i = this.results_.children.length; i--;) {
                this.results_.children[i].remove();
            }
        }
    };

    MaterialChipInput.prototype.mouseDown_ = function(event) {
        this.input_.focus();
    };

    MaterialChipInput.prototype.keyDown_ = function(event) {
        var code = event.which || event.keyCode;
        if(code === 8 && !this.input_.value) {
            // remove last tag if input is empty
            if(this.element_.children.length > 1) {
                this.element_.children[this.element_.children.length - 2].remove();
            }
        }
        if(code === 13) {
            // prevent enter from submitting the form
            event.preventDefault();
        }
    };

    MaterialChipInput.prototype.keyUp_ = function(event) {
        var code = event.which || event.keyCode;
        // TODO use more reasonable logic here
        if([13, 32, 188].indexOf(code) > -1) {
            var content = this.input_.value.replace(/[^0-9a-zäüö]/gi, '');
            if(content) {
                var currentChips = this.getChips();
                // ignore duplicates
                if(currentChips.indexOf(content) === -1) {
                    this.addChip_(content);
                    this.updateTarget_();
                    this.element_.classList.remove('is-dirty');
                }

                // delete search results
                this.clearResults_();
            }
            this.input_.value = '';
        } else {
            this.startSearch_();
        }
        event.preventDefault();
    };

    MaterialChipInput.prototype.addSearch = function(search) {
        this.results_ = document.createElement('ul');
        this.results_.classList = 'results';
        this.inputs_.insertBefore(this.results_, this.input_.nextSibling);
        this.options_.search = search;

        // TODO add onclick handler
        /* objs.results.on('click', 'li', function() {
         var text = $(this).text();
         if(getChips().indexOf(text) === -1) {
         insertChip(text);
         }
         objs.results.empty();
         objs.input.val('');
         });*/
    };

    MaterialChipInput.prototype.init = function() {
        if(this.element_) {
            // wrap all content in the .inputs div
            this.element_.innerHTML = '<div class="inputs">' + this.element_.innerHTML + '</div>';
            this.inputs_ = this.element_.children[0];

            this.input_ = this.element_.getElementsByClassName('mdl-textfield__input')[0];
            this.input_.addEventListener('keydown', this.keyDown_.bind(this));
            this.input_.addEventListener('keyup', this.keyUp_.bind(this));
            this.target_ = this.element_.getElementsByClassName('mdl-chipfield__input')[0];

            // let the whole element look like a input field
            this.element_.addEventListener('click', this.mouseDown_.bind(this));

            // set the default options
            this.options_ = {
                maximum: Number.MAX_VALUE,
                separator: ','
            };

            // initialize the chips
            if(this.target_.value) {
                // initialize the chips
                this.target_.value.split(this.options_.separator).forEach(this.addChip_.bind(this));
            }
        }
    }
})();
