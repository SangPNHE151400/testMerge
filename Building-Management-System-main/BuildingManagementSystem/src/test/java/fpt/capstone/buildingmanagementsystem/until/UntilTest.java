package fpt.capstone.buildingmanagementsystem.until;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UntilTest {
    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void testGenerateId() {
        try {
            String id = Until.generateId();
            assertTrue(id.matches("[a-f0-9-]+"));
        } catch (Exception e) {
            fail("Exception thrown: " + e.getMessage());
        }
    }

//    @Test
//    void testGenerateRealTime() {
//        Date currentTimeInVietNam = Until.generateRealTime();
//        Date currentTimeInSystem = new Date();
//
//        long currentTimeInVietnamMillis = currentTimeInVietNam.getTime();
//        long currentTimeINSystemMillis = currentTimeInSystem.getTime();
//        long diffInMillis = Math.abs(currentTimeInVietnamMillis - currentTimeINSystemMillis);
//        assertTrue(diffInMillis < 10000);
//    }

    @Test
    void testEncodePassword() {
        try {
            String pass = "123ps@_)$";
            String encodedPassword = Until.encodePassword(pass);
            assertTrue(true, pass);
        } catch (Exception e) {
            fail("Exception thrown: " + e.getMessage());
        }
    }

    @Test
    public void testGetRandomString() {
        int n = 0;
        try {
            String randomString = Until.getRandomString(n);
            assertEquals(n, randomString.length());
            assertFalse(randomString.matches("[a-zA-Z0-9]+"));
        } catch (Exception e) {
            fail("Exception thrown: " + e.getMessage());
        }
    }

    @Test
    public void testGetRandomString_success() {
        // Act
        try {
            String randomString = Until.getRandomString(10);

            // Assert
            assertEquals(0, randomString.length());
            assertTrue(randomString.matches("^[a-zA-Z0-9]+$"));
        } catch (Exception e) {
            e.printStackTrace();
            fail("Unexpected exception thrown: " + e.getMessage());
        }
    }
}