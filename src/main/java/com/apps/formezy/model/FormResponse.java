package com.apps.formezy.model;

import java.time.LocalDateTime;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="FormResponses")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormResponse {
	
	//default constructor
	public FormResponse(String id, String formId, Object response) {
		this.id = id;
		this.formId = formId;
		this.response = response;
	}
	@Id
	private String id;
	private Object response;
	private String formId;
	private LocalDateTime created;
	

}
