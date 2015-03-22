package serverStarter;

import xmlLoader.Handle;
import xmlLoader.HandlerData;
import xmlLoader.HandlerListData;
import xmlLoader.ServerListData;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;

import proactor.NioEventHandler;
import proactor.Proactor;
import reactor.EventHandler;
import reactor.Reactor;
 
public class ServerInitializer {

	public static Logger logger = Logger.getLogger(ServerInitializer.class.getName());

	public static void main(String[] args) {
		int port = 5005;
		String serverName = "reactor";
		
		logger.fatal(serverName + " Server ON :" + port);
		
		if ("reactor".equals(serverName)) {
			Reactor reactor = new Reactor(port);
			
			ArrayList<Handle> handlers = getHandlerList(serverName);
			for(Handle handler : handlers) {
				try {
					reactor.registerHandler(handler.getHeader(), (EventHandler)Class.forName( handler.getClassName() ).newInstance());
				} catch (InstantiationException | IllegalAccessException
						| ClassNotFoundException e) {
					e.printStackTrace();
					serverStarter.ServerInitializer.logger.error(e.getMessage());
				}
			}
			
			reactor.startServer();
		} else if ("proactor".equals(serverName)) {
			Proactor proactor = new Proactor(port);
			
			ArrayList<Handle> handlers = getHandlerList(serverName);
			
			for(Handle handler : handlers) {
				proactor.registerHandler(handler.getHeader(), handler.getClassName());
			}
			
			proactor.startServer();
		}
		

		
		logger.fatal("Server OFF");
	}
	

	private static ArrayList<Handle> getHandlerList(String serverName) {
		ArrayList<Handle> handlers = new ArrayList<Handle>();
		
		try {
			Serializer serializer = new Persister();
			File source = new File("HandlerList.xml");
			
			ServerListData serverList = serializer.read(ServerListData.class, source);
			
			for (HandlerListData handlerListData : serverList.getServer()) {
				
				if (serverName.equals(handlerListData.getName())) {
					List<HandlerData> handlerList = handlerListData.getHandler();
					for (HandlerData handler : handlerList) {
						handlers.add(new Handle(handler.getHeader(),handler.getHandler()));
					}
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			serverStarter.ServerInitializer.logger.error(e.getMessage());
		}
		
		
		return handlers;
		
	}

}
