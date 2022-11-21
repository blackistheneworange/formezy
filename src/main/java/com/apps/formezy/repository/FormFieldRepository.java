package com.apps.formezy.repository;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.apps.formezy.model.FormField;

@Repository
public interface FormFieldRepository extends MongoRepository<FormField, String> {

	default <S extends FormField> S insertCustom(S entity) {
		entity.setCreated(LocalDateTime.now());
		entity.setUpdated(LocalDateTime.now());
		return insert(entity);
	}

	default <S extends FormField> S updateCustom(S entity) {
		entity.setUpdated(LocalDateTime.now());
		return save(entity);
	}
	
	

}
