package com.apps.formezy.repository;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.apps.formezy.model.FormAnalytics;

@Repository
public interface FormAnalyticsRepository extends MongoRepository<FormAnalytics, String> {

	default <S extends FormAnalytics> S insertCustom(S entity) {
		entity.setCreated(LocalDateTime.now());
		entity.setUpdated(LocalDateTime.now());
		return insert(entity);
	}

	default <S extends FormAnalytics> S updateCustom(S entity) {
		entity.setUpdated(LocalDateTime.now());
		return insert(entity);
	}
}
