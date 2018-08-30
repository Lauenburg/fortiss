package org.fortiss.ieservices.util;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;

public class TimestampToLocalDateTime {
	public static LocalDateTime convert(long time) {
		LocalDateTime result = LocalDateTime.ofInstant(Instant.ofEpochMilli(time), TimeZone.getDefault().toZoneId());
		return result;
	}

}
