var lastupdate = 0;

//var querystring = window.location.querystring;
//var myValue = querystring["User"];

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "unknown!";
}



var username = getQueryVariable("User");

function formatState(state, time)
{
	dateStr = dateFormat(new Date(parseInt(time)*1000), "mmm dS, yyyy, h:MM TT");
    return state.charAt(0).toUpperCase() + state.slice(1) + " as of " + dateStr;
};

function click(name, userid)
{
	$.ajax({
		url:"clk",
		data:{'id':name, 'userid':userid}
	})
};

$.ajax({
	url:"cfg",
	success: function(data) {
		for (var i = 0; i < data.length; i++) {
			var id = data[i][0];
			var name = data[i][1];
			var state = data[i][2];
			var time = data[i][3];
			var li = '<li id="' + id + '" data-icon="false">';
			li = li + '<a href="javascript:click(\'' + id + '\', \'' + username + '\');" onclick="return confirm(\'أكيد؟\')">';
			li = li + '<img src="img/'+state + '.png" />';
			li = li + '<h3>' + name + '</h3>';
			li = li + '<p>' + formatState(state, time) + '</p>';
			li = li + '</a></li>';
			$("#doorlist").append(li);
			$("#doorlist").listview('refresh');
		}
	}
});

function poll(){
	$.ajax({
    	url: "upd",
    	data: {'lastupdate': lastupdate },
    	success: function(response, status) {
    		lastupdate = response.timestamp;
    		for (var i = 0; i < response.update.length; i++) {
    			var id = response.update[i][0];
    			var state = response.update[i][1];
    			var time = response.update[i][2];
    			$("#" + id + " p").html(formatState(state, time));
    			$("#" + id  + " img").attr("src", "img/" + state + ".png")
    			$("#doorlist").listview('refresh');
    		}
    		//$("#Left_Door p").html(JSON.stringify(response.update));
    		setTimeout('poll()', 1000);
        },
        // handle error
        error: function(XMLHttpRequest, textStatus, errorThrown){
            // try again in 10 seconds if there was a request error
            setTimeout('poll();', 10000);
        },
    	//complete: poll,
    	dataType: "json",
    	timeout: 30000
    	});
};

$(document).live('pageinit', poll);
