import twitter4j.FilterQuery;
import twitter4j.HashtagEntity;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterException;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;

import java.io.*;
import java.sql.*;

/**
 * @author Shashank G (NYU)
 * 
 */

public final class TweetGet2 {
    /**
     * Main entry of this application.
     *
     * @param args
     * 
     * 	OAUTH Authentication
     *  (Consumer) API Key : VuuIboYWBcreKmDFZ8OM57UeY
     *  (Consumer )API Secret: ########################
     *  
     *  (OAuth) Access Token: 3066211929-HU8RFHDEwV0XbLs3RXfKg7Yx6FGPega4H05P1P4
     *  (OAuth) Access Token Secret: #################################
     *  
     */
	
	static Connection con = null;
	static PreparedStatement query = null;		
	Statement st = null;
	ResultSet rs = null;				// Stores result of SQL query operation
   	
    public static void main(String[] args) throws TwitterException, IOException {
    	
    	/*
    	 * Setting up the database - AWS RDS using MySQL engine.
    	 * 
    	 * */
    	
    	//CONNECTION STRINGS TO AWS RDS
    	//final String db_url= "jdbc:mysql://myclouddb.crcwdwxbzqzs.us-east-1.rds.amazonaws.com:3306/tweetmap";		// from AWS-RDS;
		
    	final String db_url= "jdbc:mysql://############################/dbname";		// from AWS-RDS;
    	final String user = "##username##";
		final String pass = "##password##";
    	
    	//just fill this
    	 ConfigurationBuilder cb = new ConfigurationBuilder();
         cb.setDebugEnabled(true)
           .setOAuthConsumerKey("VuuIboYWBcreKmDFZ8OM57UeY")
           .setOAuthConsumerSecret("##############################")
           .setOAuthAccessToken("3066211929-HU8RFHDEwV0XbLs3RXfKg7Yx6FGPega4H05P1P4")
           .setOAuthAccessTokenSecret("##########################");
         
        TwitterStream twitterStream = new TwitterStreamFactory(cb.build()).getInstance();
        
        // location based streaming;
        double [][] locs = {{68.1,8.06},{97.41,37.10}};
        FilterQuery filter = new FilterQuery();
        filter.locations(locs);
        
        try {
			con = DriverManager.getConnection(db_url, user, pass);
		} catch (SQLException e1) {
			e1.printStackTrace();
		}
        
        StatusListener listener = new StatusListener() {	
        	@Override
            public void onStatus(Status status) {
            	
        		if (status.getGeoLocation() != null && status.getLang().equalsIgnoreCase("en")){          			//status.getLang().equalsIgnoreCase("en") {
	
        			int tweet_id = (int)status.getId();
        			String user_handle = status.getUser().getScreenName();
        			String message = status.getText();
        			
        			//if (status.getHashtagEntities().length > 0){
        			StringBuilder sb = new StringBuilder();
        			for (HashtagEntity tag : status.getHashtagEntities()){
        				sb.append(" "+tag.getText());		// Hashtag entity is a JSON object.
        			}
        			//}
        			
        			double longi =  status.getGeoLocation().getLongitude();
        			double lat = status.getGeoLocation().getLatitude();

        			String date = status.getCreatedAt().toString();
        			
        			String twt = "\n@" + user_handle+" :  " + message+ "Country: "+ status.getPlace().getCountry()+"\n";
        			System.out.println(twt);
            		
        			//Writing to database - AWS RDS.
        			try {
						query = con.prepareStatement("INSERT INTO tweetbase VALUES(?,?,?,?,?,?,?)");
						query.setInt(1, tweet_id);
						query.setString(2, user_handle);
						query.setString(3, message);
						query.setString(4, sb.toString().trim());
						query.setDouble(5, longi);
						query.setDouble(6, lat);
						query.setString(7, date);
						
						query.executeUpdate();
						
						System.out.println("Stored in AWS RDS! Successful..");
						
					} catch (SQLException e) {
						//e.printStackTrace();
						System.out.println(e.getMessage());
					}
            		
            	}	// end of if
            
        	} // end of OnStatus
            
      
            @Override
            public void onDeletionNotice(StatusDeletionNotice statusDeletionNotice) {
                //System.out.println("Got a status deletion notice id:" + statusDeletionNotice.getStatusId());
            }

            @Override
            public void onTrackLimitationNotice(int numberOfLimitedStatuses) {
                System.out.println("Got track limitation notice:" + numberOfLimitedStatuses);
            }

            @Override
            public void onScrubGeo(long userId, long upToStatusId) {
                System.out.println("Got scrub_geo event userId:" + userId + " upToStatusId:" + upToStatusId);
            }

            @Override
            public void onStallWarning(StallWarning warning) {
                System.out.println("Got stall warning:" + warning);
            }

            @Override
            public void onException(Exception ex) {
                ex.printStackTrace();
            }
        	       	
        };	// end of status listener.
        twitterStream.addListener(listener);
        twitterStream.sample();
        twitterStream.filter(filter);
        
   
    }
}