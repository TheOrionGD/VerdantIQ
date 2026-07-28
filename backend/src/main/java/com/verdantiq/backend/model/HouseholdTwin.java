package com.verdantiq.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "household_twins")
public class HouseholdTwin {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private int householdSize;
    private String dietType; // VEGAN, VEGETARIAN, OMNIVORE, etc.
    private double utilityBillAvgMonthly;
    private String primaryTransitMode; // PUBLIC_TRANSIT, EV, BICYCLE, GAS_CAR
    private double baselineCo2ScoreKg;
    private Instant updatedAt;
}
