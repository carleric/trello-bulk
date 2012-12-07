$(document).ready(function(){

	var onAuthorize = function() {
	    updateLoggedIn();
	    $("#output").empty();
	    
	    Trello.members.get("me", function(member){
	        $("#fullName").text(member.fullName);
	    
	        var $boards = $('#boards');
	        $boards.text("Loading Boards...");

	        Trello.get("members/my/boards", function(boards) {
	            $boards.empty();
	            $("<div>").text("Click a board to load lists").appendTo($boards);
	            
	            $.each(boards, function(ix, board) {
	                $("<a>")
	                .addClass("board")
	                .text(board.name)
	                .appendTo($boards)
	                .click(function(){
	                    Trello.get("boards/" + board.id + "/lists", function(lists){
	                    		$lists = $('#lists');
	                    		$lists.empty();
	                    		$.each(lists, function(ix, list){
	                    			$("<a id="+list.id+">")
					                .addClass("list")
					                .text(list.name)
					                .appendTo($lists)
					                .click(function(){
					                    //alert(list.name)
					                })
					            
	                    		})
	                    		$lists.selectable();

	                    });
	                    Trello.get("boards/" + board.id + "/labelNames", function(labels){
	                    		$labels = $('#labels');
	                    		$labels.empty();
	                    		for(var prop in labels){
	                    			$("<a>")
					                .addClass("label")
					                .text(prop+':'+labels[prop])
					                .appendTo($labels)
	                    		}
	                    		
	                    		$labels.selectable();
	                    });
	                })
	            });
	            $boards.selectable();  
	        });
	    });

		$('#importBtn').click(function(event){
			var lines = $('#bulk-text').val().split('\n');
			var selectedlist = $('#lists .ui-selected').attr('id');
			var selectedLabel = $('#labels .ui-selected').text().split(':')[0];
			$.each(lines, function(i, line){
				Trello.post("cards/", {name: line, pos: 'top', idList: selectedlist}, function(card){
					Trello.post("cards/"+card.id+"/labels", {value: selectedLabel});
				});
			});
		});

	};

	var updateLoggedIn = function() {
	    var isLoggedIn = Trello.authorized();
	    $("#loggedout").toggle(!isLoggedIn);
	    $("#loggedin").toggle(isLoggedIn);        
	};
	    
	var logout = function() {
	    Trello.deauthorize();
	    updateLoggedIn();
	};
	                          
	Trello.authorize({
	    interactive:false,
	    success: onAuthorize
	});

	$("#connectLink")
	.click(function(event){
		event.preventDefault();
	    Trello.authorize({
	        type: "popup",
	        success: onAuthorize,
	        scope: { write: true, read: true }
	    })
	});
	    
	$("#disconnect").click(logout);

});