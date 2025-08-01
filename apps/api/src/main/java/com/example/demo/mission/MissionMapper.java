package com.example.demo.mission;

import java.util.List;
import java.util.stream.Collectors;

public class MissionMapper {
    public static MissionResponse toDto(Mission mission) {
        MissionResponse dto = new MissionResponse();
        dto.setIdMission(mission.getIdMission());

        if (mission.getTraveler() != null) {
            dto.setTravelerId(mission.getTraveler().getIdUser());
            dto.setTravelerPseudo(mission.getTraveler().getPseudo());
        } else {
            dto.setTravelerId(null);
            dto.setTravelerPseudo(null);
        }

        if (mission.getOrder() != null) {
            dto.setOrderId(mission.getOrder().getIdOrder());
        } else {
            dto.setOrderId(null);
        }
        dto.setAcceptanceDate(mission.getAcceptanceDate());
        dto.setStatus(String.valueOf(mission.getStatus()));
        dto.setCreatedAt(mission.getCreatedAt());
        dto.setUpdatedAt(mission.getUpdatedAt());
        dto.setIsPublic(mission.getIsPublic());
        dto.setisDelivered(mission.getMissionDelivered());
        dto.setIsReceived(mission.getMissionReceived());
        return dto;
    }

    public static List<MissionResponse> toDtoList(List<Mission> missions) {
        return missions.stream()
                .map(MissionMapper::toDto)
                .collect(Collectors.toList());
    }
}
