$(function() {
    var list = $("#projectors table tbody");
    var socket = io.connect('/projectors');

    socket.on('connection', function() {
        list.empty();
    });

    function template(obj) {
        var tag = $('<tr>').attr("data-id", obj.id);
        tag.append($('<td>')); // color
        tag.append($('<td>').text(obj.name));
        tag.append($('<td>')); // options
        return tag;
    }

    socket.on('create', function(obj) {
        list.append(template(obj));
    });

    socket.on('update', function(obj) {
        list.children('[data-id="' + obj.id + '"]').replaceWith(template(obj));
    });

    socket.on('delete', function(id) {
        list.children('[data-id="' + id + '"]').remove();
    });
});
