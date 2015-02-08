// # Building a Freeboard Plugin
//
// A freeboard plugin is simply a javascript file that is loaded into a web page after the main freeboard.js file is loaded.
//
// Let's get started with an example of a datasource plugin and a widget plugin.
//
// -------------------

// Best to encapsulate your plugin in a closure, although not required.
(function()
{
	// ## A Datasource Plugin
	//
	// -------------------
	// ### Datasource Definition
	//
	// -------------------
	// **freeboard.loadDatasourcePlugin(definition)** tells freeboard that we are giving it a datasource plugin. It expects an object with the following:
	 var smartofficeWidget = function (settings) {
        var self = this;

        var office_timeTitleElement = $('<h2 class="section-title"></h2>');
        var office_timeValueElement = $('<div class="tw-value" style="font-size: 30px; max-width: 100%;"></div>');

        var newsTitleElement = $('<h2 class="section-title"></h2>');
        var newsValueElement = $('<div class="tw-value" style="font-size: 30px; max-width: 100%;"></div>');

        var alarmTitleElement = $('<h2 class="section-title"></h2>');
        var alarmValueElement = $('<div class="tw-value" style="font-size: 30px; max-width: 100%;"></div>');

        var sparklineElement = $('<div class="sparkline"></div>');

        this.render = function (element) {
            $(element).append(office_timeTitleElement).append(office_timeValueElement)
            			.append(newsTitleElement).append(newsValueElement)
            			.append(alarmTitleElement).append(alarmValueElement)
            			.append(sparklineElement);
        }

        this.onSettingsChanged = function (newSettings) {

        	// office time - html
            office_timeTitleElement.html((_.isUndefined(newSettings.office_time) ? "" : "Office Time"));
            office_timeValueElement.html((_.isUndefined(newSettings.office_time) ? "" : newSettings.office_time));

            // news - html
            is_news = (newSettings.weather || newSettings.business
            			|| newSettings.politics || newSettings.health
            				|| newSettings.education || newSettings.science
            			    	|| newSettings.technology || newSettings.entertainment);
            
            news_config = (newSettings.weather ? "weather" : "") 
				    		+ (newSettings.business ? ",business" : "")
            					+ (newSettings.politics ? ",politics" : "")
            						+ (newSettings.health ? ",health" : "")
            							+ (newSettings.education ? ",education" : "")
            								+ (newSettings.science ? ",science" : "")
            			    					+ (newSettings.technology ? ",technology" : "")
            			    						+ (newSettings.entertainment ? ",entertainment" : "");
            newsTitleElement.html(is_news ? "News" : "");
            newsValueElement.html(is_news ? news_config : "");

            // alarm - html
            alarmTitleElement.html((_.isUndefined(newSettings.alarm) ? "" : "Alarm"));
            alarmValueElement.html((_.isUndefined(newSettings.alarm) ? "" : newSettings.alarm));



            if(!newSettings.read){
                console.log("stop request sending");
                $.post("http://localhost:1880/stop",
                    {
                        data:newSettings.read,
                        async: true
                    }, function(data){
                    }
                );
            }
            if(newSettings.read){
                 console.log("read request sending");
                $.post("http://localhost:1880/read",
                    {
                        data:newSettings.read,
                        async: true
                    }, function(data){
                       
                    }
                );
            }
            
            console.log("going for write");
            // sending data to be saved in file
            $.post("http://localhost:1880/writeFile",
                {
                    type:"office_time",
                    data:(_.isUndefined(newSettings.office_time) ? "" : newSettings.office_time)
                }, function(data){}
            );

            $.post("http://localhost:1880/writeFile",
                {
                    type:"news",
                    data:(is_news ? news_config : "" )
                }, function(data){}
            );

            $.post("http://localhost:1880/writeFile",
                {
                    type:"alarm",
                    data:(_.isUndefined(newSettings.alarm) ? "" : newSettings.alarm)
                }, function(data){}
            );

            console.log("coming from write");
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            addValueToSparkline(sparklineElement, newValue);
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 3;
        }

        this.onSettingsChanged(settings);
    };

    
	freeboard.loadWidgetPlugin({
        type_name: "Sparkline",
        display_name: "Smart Office",
        "external_scripts" : [
            "plugins/thirdparty/jquery.sparkline.min.js"
        ],
        settings: [
            {
                name: "office_time",
                display_name: "Office Time",
                type: "text",
                default_value: "09:00",
            },
            {
                name: "weather",
                display_name: "Weather News",
                type: "boolean",
                default_value: true
            },
            {
                name: "business",
                display_name: "Business News",
                type: "boolean",
                default_value: true
            },
            {
                name: "politics",
                display_name: "Politics News",
                type: "boolean",
                default_value: true
            },
            {
                name: "health",
                display_name: "Health News",
                type: "boolean",
                default_value: true
            },
            {
                name: "education",
                display_name: "Education News",
                type: "boolean",
                default_value: true
            },
            {
                name: "science",
                display_name: "Science News",
                type: "boolean",
                default_value: true
            },
            {
                name: "technology",
                display_name: "Technology News",
                type: "boolean",
                default_value: true
            },
            {
                name: "entertainment",
                display_name: "Entertainment News",
                type: "boolean",
                default_value: true
            },
            {
                name: "read",
                display_name: "Read News",
                type: "boolean",
                default_value: false
            },
            {
                name: "alarm",
                display_name: "Alarm",
                type: "text"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new smartofficeWidget(settings));
        }
    });
}());