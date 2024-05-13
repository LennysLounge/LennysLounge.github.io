# Assetto Corsa Competizione Weather Simulator

This is a recreation of the weather simulation used in assetto corsa competizione reimplemented in javascript.
Use this to find the correct weather settings for your race.

The weekend forecast that is displayed here is only an example of that kind of weather the settings will produce.
The server will take your weather settings and always generate a random weekend forecast that may be very different from the forecast displayed here.

Visit [https://www.lennyslounge.net/ACC%20Weather%20sim](https://www.lennyslounge.net/ACC%20Weather%20sim/) to view the simulator.


## How accurate is the simulation?
Very accurate and not at all at the same time.

I have reverse engineered the weather simulation algorithm from the game using various tools and recreated it one for one in this project.
The weather forecast is generated from multiple seed numbers. These seed numbers are randomly generated when the game starts and it is impossible to predict them.
To ensure accuracy i have done statistical analysis on the generation of these seed numbers and made sure that the seed number generated for this simulator follow the same kind of statistical qualities as the originals.
For this reason a single weather forecast can be totally wrong but when simulated over multiple hundred weekends it is possible to understand how likely certain weather patterns are.

To get the most out of the simulator i recomend to use the forecast to create the weather patterns that you would like to see.
For example you can create weather patterns with short but very intense rain storms or frequent but light rain.
Then use the weekend statistics section to understand how likely wet/dry/mixed conditions are.
Using a time multiplyer can be helpfull to make mixed conditions more likely.


