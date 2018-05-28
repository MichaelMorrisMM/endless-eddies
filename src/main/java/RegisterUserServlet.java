import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/register-user")
public class RegisterUserServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpUtil.doPostSetup(response);

        String email = request.getParameter("email");
        if (!Util.isNonEmpty(email)) {
            HttpUtil.printPOSTResult(response, false, "Email must be specified");
            return;
        }
        email = email.trim().toLowerCase();
        if (!DatabaseConnector.verifyEmailUnique(email)) {
            HttpUtil.printPOSTResult(response, false, "Email is already associated with a user");
            return;
        }

        String password = request.getParameter("password");
        if (!Util.isNonEmpty(password)) {
            HttpUtil.printPOSTResult(response, false, "Password must be specified");
            return;
        }

        // If this is the very first user created, set as admin
        // Otherwise, set as non-admin
        boolean isAdmin = DatabaseConnector.isFirstUser();

        String salt = PasswordUtil.createSalt();
        String hashedPassword = PasswordUtil.hashPassword(password, salt);
        if (DatabaseConnector.createNewUser(email, hashedPassword, salt, isAdmin)) {
            HttpUtil.printPOSTResult(response, true, "User created");
        } else {
            HttpUtil.printPOSTResult(response, false, "An error occurred");
        }
    }

}
