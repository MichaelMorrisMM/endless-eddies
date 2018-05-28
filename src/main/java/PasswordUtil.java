import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordUtil {

    private static final int ITERATIONS = 1000;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_LENGTH = 64;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA512";

    public static String createSalt() {
        SecureRandom srandom = new SecureRandom();
        byte[] data = new byte[SALT_LENGTH];
        srandom.nextBytes(data);
        return formatAsString(data);
    }

    public static String hashPassword(final String password, final String salt) {
        char[] passwordChars = password.toCharArray();
        byte[] saltBytes = salt.getBytes();
        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
            PBEKeySpec spec = new PBEKeySpec(passwordChars, saltBytes, ITERATIONS, KEY_LENGTH);
            SecretKey key = skf.generateSecret(spec);
            return formatAsString(key.getEncoded());
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            return null;
        }
    }

    private static String formatAsString(byte[] bytes) {
        return String.format("%x", new BigInteger(bytes));
    }

}
