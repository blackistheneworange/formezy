package com.apps.formezy.repository;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.apps.formezy.model.Form;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {

	default <S extends Form> S insertCustom(S entity) {
		entity.setCreated(LocalDateTime.now());
		entity.setUpdated(LocalDateTime.now());
		return insert(entity);
	}

	default <S extends Form> S updateCustom(S entity) {
		entity.setUpdated(LocalDateTime.now());
		return save(entity);
	}
	
	

}
