package com.verdantiq.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "challenges")
public class Challenge {

    @Id
    private String id;

    private String title;
    private String description;
    private double co2RewardKg;
    private String category;
    private String institutionId;
    private boolean active;
}
