(function ($) {
	$.extend($, {
		hashlist: function (container) {
			var getRandomInt = function (max) {
					return Math.floor(Math.random() * Math.floor(max));
				},
				root = $('<div class="hashlist" />'),
				form = $('<form action="" class="hashlist-form"><input name="' + hashName + '" placeholder="Type hash value here" type="text"><button type="submit">submit</button></form>'),
				list = $('<ul class="hashlist-list"></ul>'),
				hashName = (!$(container)
					.is('[data-hashname]')) ? 'hash' + getRandomInt(100) : $(container)
				.data('hashname');
			$(container)
				.attr('data-hashname', hashName);
			console.log(hashName);
			list.appendTo(root);
			form.appendTo(root);
			root.appendTo($(container));
			var getHashObj = function () {
					var retObj = {
						items: null,
						hashes: decodeURIComponent(location.hash.replace('#', ''))
							.split('&'),
						hashIndex: -1
					};
					retObj.hashes.forEach(function (val, ind) {
						var hash = val.split('=');
						if (hash[0] === hashName) {
							retObj.hashIndex = ind;
							retObj.items = hash[1].split(',');
						}
					});
					return retObj;
				},
				hashCheckAndUpdate = function () {
					var hashObj = getHashObj();
					$(hashObj.items)
						.each(function (ind, el) {
							if (!el || el.length === 0) return;
							var element = list.children('[data-tag="' + el + '"]');
							if (element.length < 1) {
								$('<li data-tag="' + el + '" class="keep">' + el + '</li>')
									.appendTo(list);
							} else element.addClass('keep');
						});
					list.children(':not(.keep)')
						.remove();
					list.children('.keep')
						.removeClass('keep');
				},
				handleListItemClick = function (e) {
					var hashObj = getHashObj();
					var item = $(e.target);
					var itemData = item.data('tag');
					var needle = new RegExp(',?' + itemData + '(?=,|$)', 'g');
					hashObj.hashes[hashObj.hashIndex] = hashObj.hashes[hashObj.hashIndex].replace(needle, '');
					if (hashObj.hashes[hashObj.hashIndex] == hashName + '=') hashObj.hashes.splice(hashObj.hashIndex, 1);
					location.hash = hashObj.hashes.join('&');
				},
				handleInputSubmit = function (e) {
					e.preventDefault();
					var hashObj = getHashObj();
					if (hashObj.hashIndex == -1) {
						if (hashObj.hashes[0] === '') {
							hashObj.hashes[0] = hashName + '=';
						} else {
							hashObj.hashes.push(hashName + '=');
						}
						hashObj.hashIndex = hashObj.hashes.length - 1;
					}
					var currHashItems = hashObj.hashes[hashObj.hashIndex].split(','),
						form = $(e.target),
						tField = form.find('input[type="text"]'),
						tagText = tField.val();
					if (currHashItems.indexOf(tagText) > -1) {
						alert('Tag already present!');
						return;
					} else if (tagText.length < 1) {
						alert('Tag should have at lease one char.!');
						return;
					}
					hashObj.hashes[hashObj.hashIndex] += (hashObj.hashes[hashObj.hashIndex] === hashName + '=') ? tagText : ',' + tagText;
					location.hash = hashObj.hashes.join('&');
					tField.val('');
				};
			form.on('submit', handleInputSubmit);
			list.on('click', 'li', handleListItemClick);
			$(window)
				.on('hashchange', hashCheckAndUpdate)
				.trigger('hashchange');
			return root;
		}
	});
}(jQuery));
$(document)
	.ready(function () {
		var i = 0;
		$('.col')
			.each(function () {
				$.hashlist($(this));
				i++;
			});
	});
