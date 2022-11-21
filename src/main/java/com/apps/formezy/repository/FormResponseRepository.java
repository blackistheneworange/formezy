package com.apps.formezy.repository;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.apps.formezy.model.FormResponse;

@Repository
public interface FormResponseRepository extends MongoRepository<FormResponse, String> {

	default <S extends FormResponse> S insertCustom(S entity) {
		entity.setCreated(LocalDateTime.now());
		return insert(entity);
	}

}
