$(function() {
    var list = $("#projectors table tbody");
    var socket = io.connect('/projectors');

    socket.on('connection', function() {
        list.empty();
    });

    socket.on('add', function(props) {
        var tag = $('<tr>').attr("id", "projector:" + props.id);
        tag.append($('<td>')); // color
        tag.append($('<td>').text(props.title));
        tag.append($('<td>')); // options
        list.append(tag);
    });
});
