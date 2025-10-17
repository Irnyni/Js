package com.games.games.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.games.games.Entity.Games;
import com.games.games.Repository.GamesRepo;

@Service
public class GameService {
    private GamesRepo gamesRepo;

    @Autowired
    public GameService(GamesRepo gamesRepo) {
        this.gamesRepo = gamesRepo;
    }

    public List<Games> buscar() {
        return gamesRepo.findAll();
    }

    public Games criar(Games game) {
        return gamesRepo.save(game);

    }

}
