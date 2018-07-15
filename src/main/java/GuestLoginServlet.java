import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/guest-login")
public class GuestLoginServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
        if (!config.allowGuestMode) {
            HttpUtil.printPOSTResult(response, false, "Guest Mode is not enabled");
            return;
        }

        User guest = User.newGuestUser();
        if (SessionManager.createGuestSession(guest, response)) {
            HttpUtil.printPOSTResult(response, guest, "Guest session created");
        } else {
            HttpUtil.printPOSTResult(response, false, "Unable to create guest session");
        }
    }

}
