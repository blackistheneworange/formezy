package com.apps.formezy.model;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Document(collection="FormFields")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormField {
	
	@Id
	private String id;
	@NotNull(message = "Form field cannot be created without parent form")
	private String formId;
	@NotNull(message = "Form field name cannot be empty")
	private String name;
	@NotNull(message = "Form field answer type cannot be empty")
	private String responseType;
	@NotNull(message = "Form field answer format cannot be empty")
	private boolean required=false;
	private String responseFormat;
	private LocalDateTime created;
	private LocalDateTime updated;
	

}
