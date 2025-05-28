package com.example.demo.tracking;

public class TrackingResponseDto {
    private float latitude;
    private float longitude;

    public TrackingResponseDto(float latitude, float longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public float getLatitude() {
        return latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    @Override
    public String toString() {
        return "TrackingResponseDto{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}

