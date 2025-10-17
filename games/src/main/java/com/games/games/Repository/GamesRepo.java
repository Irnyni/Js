package com.games.games.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.games.games.Entity.Games;

public interface GamesRepo extends JpaRepository<Games, Long> {

}
