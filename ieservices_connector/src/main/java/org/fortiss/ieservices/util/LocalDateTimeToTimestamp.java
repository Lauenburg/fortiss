package org.fortiss.ieservices.util;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class LocalDateTimeToTimestamp {
	public static long convert(LocalDateTime ldt) {
		long result = ldt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
		return result;
	}
}
