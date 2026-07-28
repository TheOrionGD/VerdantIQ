package com.verdantiq.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TrackerLogRequest {

    @NotBlank(message = "Category is required (transport, energy, water, waste, trees)")
    private String category;

    @Min(value = 0, message = "Amount must be non-negative")
    private double amount;

    private String unit;

    private Double longitude;
    private Double latitude;
}
