package com.apps.formezy.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormRequestBody {

	@Id
	private String id;
	@Indexed(unique = true)
	@NotNull(message = "Form name cannot be empty")
	private String name;
	@NotNull(message = "Form description cannot be empty")
	private String desc;
	private String successMessage;
	private String type="normal";
	private boolean active=true;
	private String companyName;
	//contains ids for FormFields collection
	private List<FormField> fields = new ArrayList<FormField>();
	private LocalDateTime created;
	private LocalDateTime updated;
	

}
