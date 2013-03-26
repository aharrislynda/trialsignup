(function (lp, $) {
	lp.RefreshEyebrowMenuHelper = function (URLs) {
		// Variables need to be set by Initialize
		var urls = $.extend({
			playlistGet: "/Playlist/Get", 								//Url.PlaylistGet()
			playlistGetItems: "/Playlist/{0}/GetItems", 				//Url.PlaylistGetItems("{0}")
			playlistSelect: "/Queue?playlistId={0}", 				//Url.Playlist("{0}")
			playlistAll: "/Queue", 									//Url.Playlist()
			findCourse: "/tutorial/0"									//Url.FindCourse(0)
		}, URLs);

		this.refreshPlaylistsMenu = function (playlistID, playlistName) {
			if (playlistID > 0) {
				$.ajax({
					type: "POST",
					dataType: "json",
					url: String.format(urls.playlistGetItems, playlistID),
					success: function (data) { renderCoursesContent(data, playlistID, playlistName); },
					cache: false
				});
			}
			else {
				$.ajax({
					type: "POST",
					dataType: "json",
					url: urls.playlistGet,
					success: function (data) { renderPlaylistsContent(data); },
					cache: false
				});
			}
		}

		renderCoursesContent = function (data, playlistID, playlistName) {
			var myContentHTML = "";
			var maxCourses = Math.min(5, data.queue.length);
			myContentHTML += "<a href=\"" + urls.playlistAll + "\"" + (playlistName.length > 17 ? " title=\"" + playlistName + "\"" : "") + ">";
			myContentHTML += (playlistName.length > 15 ? playlistName.substring(0, 15).toLowerCase() + "..." : playlistName.toLowerCase()) + " (" + data.queue.length + ")<span>view all</span></a><ol>";
			for (var i = 0; i < maxCourses; i++) {
				var item = data.queue[i];
				var courseURL = urls.findCourse; courseURL = courseURL.replace("/0", "/" + item.courseId);
				var courseName = item.courseName;
				if (courseName.length > 45) {
					courseName = courseName.substring(0, 42) + "&hellip;";
				}
				myContentHTML += "<li><a id=\"courseLink" + item.courseId + "\" href=\"" + courseURL + "\" >" + courseName + "</a></li>";
			}
			myContentHTML += "</ol>";
			$('li#liPlaylists').html(myContentHTML);
		}

		renderPlaylistsContent = function (data) {
			var myContentHTML = "";
			var maxPlaylists = Math.min(5, data.length);

			myContentHTML += "<a href=\"" + urls.playlistAll + "\">";
			myContentHTML += " playlists (" + data.length + ")<span>view all</span></a>";

			myContentHTML += "<ul>";
			for (var i = 0; i < maxPlaylists; i++) {
				myContentHTML += "<li><a href=\"" + String.format(urls.playlistSelect, data[i].PlaylistId) + "\"" + (data[i].PlaylistName.length > 17 ? " title=\"" + data[i].PlaylistName + "\"" : "") + ">";
				myContentHTML += data[i].PlaylistName;
				myContentHTML += "</a><div>(" + data[i].PlaylistItemCount + ")</div></li>";
			}
			myContentHTML += "</ul>";
			$('li#liPlaylists').html(myContentHTML);
		}
	};
})(lynda.page, jQuery);