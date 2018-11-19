import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class SessionManager {

    private static final String SESSION_COOKIE_NAME = "SESSION";
    private static final String XSRF_TOKEN = "xsrfToken";
    private static Algorithm ALGORITHM;

    static {
        SecureRandom srandom = new SecureRandom();
        byte[] secret = new byte[64];
        srandom.nextBytes(secret);
        ALGORITHM = Algorithm.HMAC512(secret);
    }

    public static boolean createSession(User user, HttpServletResponse response) {
        try {
            String xsrfToken = PasswordUtil.createSalt();
            user.currentXSRFToken = xsrfToken;

            String jwt = createJWT(user, xsrfToken);
            setCookie(jwt, false, response);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static void endSession(HttpServletResponse response) {
        setCookie("", true, response);
    }

    public static boolean createGuestSession(User guest, HttpServletResponse response) {
        return createSession(guest, response);
    }

    public static void addTimeToCurrentSession(User user, HttpServletRequest request, HttpServletResponse response) {
        try {
            DecodedJWT previousJWT = getJWT(request);
            String xsrfToken = previousJWT.getClaim(XSRF_TOKEN).asString();
            String jwt = createJWT(user, xsrfToken);
            setCookie(jwt, false, response);
        } catch (Exception e) {
        }
    }

    private static String createJWT(User user, String xsrfToken) {
        Instant now = Instant.now();
        JWTCreator.Builder builder = JWT.create()
            .withIssuedAt(Date.from(now))
            .withExpiresAt(Date.from(now.plus(30, ChronoUnit.MINUTES)))
            .withClaim(XSRF_TOKEN, xsrfToken);
        if (user.isGuest) {
            builder = builder.withClaim("idGuest", user.idGuest);
        } else {
            builder = builder.withClaim("idUser", user.idUser);
        }
         return builder.sign(ALGORITHM);
    }

    private static void setCookie(String value, boolean isEndSessionCookie, HttpServletResponse response) {
        Cookie sessionCookie = new Cookie(SESSION_COOKIE_NAME, value);
        sessionCookie.setSecure(true);
        sessionCookie.setHttpOnly(true);
        if (isEndSessionCookie) {
            response.setContentType("text/html");
            sessionCookie.setMaxAge(0);
        }
        response.addCookie(sessionCookie);
    }

    public static User checkSession(HttpServletRequest request) {
        try {
            DecodedJWT jwt = getJWT(request);
            if (isJWTTimeValid(jwt)) {
                User user = DatabaseConnector.getUserById(jwt.getClaim("idUser").asInt());
                user.currentXSRFToken = jwt.getClaim(XSRF_TOKEN).asString();
                return user;
            }
        } catch (Exception e) {
        }
        return null;
    }

    public static User checkGuestSession(HttpServletRequest request) {
        try {
            DecodedJWT jwt = getJWT(request);
            if (isJWTTimeValid(jwt)) {
                return User.getGuestUser(jwt.getClaim("idGuest").asLong());
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    private static boolean isJWTTimeValid(DecodedJWT jwt) {
        Instant now = Instant.now();
        return now.compareTo(jwt.getIssuedAt().toInstant()) > 0 && now.compareTo(jwt.getExpiresAt().toInstant()) < 0;
    }

    public static boolean isSessionTimeAlmostExpired(HttpServletRequest request) throws Exception {
        DecodedJWT jwt = getJWT(request);
        Instant now = Instant.now();
        Instant expiresAt = jwt.getExpiresAt().toInstant();
        return expiresAt.compareTo(now.plus(5, ChronoUnit.MINUTES)) < 0;
    }

    public static User checkAdminSession(HttpServletRequest request) {
        User user = checkSession(request);
        if (user != null && user.isAdmin) {
            return user;
        } else {
            return null;
        }
    }

    public static boolean checkXSRFToken(HttpServletRequest request) {
        try {
            String jwtToken = getJWT(request).getClaim(XSRF_TOKEN).asString();
            String payloadToken = request.getParameter(XSRF_TOKEN) != null ? request.getParameter(XSRF_TOKEN) : request.getHeader(XSRF_TOKEN);
            if (jwtToken != null && payloadToken != null) {
                return jwtToken.equals(payloadToken);
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    private static DecodedJWT getJWT(HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(SESSION_COOKIE_NAME) && cookie.getValue() != null) {
                    return JWT.require(ALGORITHM).build().verify(cookie.getValue());
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

}
